"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { resend } from "@/lib/resend"
import { handleServerError, ActionResponse } from "../error-handler"

/**
 * Helper to get Supabase Admin client (Service Role)
 */
function getAdminSupabase() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                get(name: string) { return undefined },
            },
        }
    )
}

type CommunicationChannels = {
    email: boolean;
    notification: boolean;
    message: boolean;
}

type UserCategory = 'all' | 'owners' | 'renters' | 'affiliates' | 'selected';

/**
 * Sends bulk communication to users via selected channels
 */
export async function sendAdminBulkCommunication(
    channels: CommunicationChannels,
    target: { category: UserCategory, userIds?: string[] },
    content: { subject: string, message: string }
): Promise<ActionResponse> {
    const supabase = getAdminSupabase();

    try {
        // 1. Get the admin user ID (sender)
        const cookieStore = await cookies();
        const client = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value },
                },
            }
        );
        const { data: { user: adminUser } } = await client.auth.getUser();
        if (!adminUser) return handleServerError("User not authenticated");

        // Verify admin role
        const { data: adminProfile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', adminUser.id)
            .single();

        if (adminProfile?.role !== 'admin') {
            return handleServerError("Unauthorized: Admin access required");
        }

        // 2. Fetch target users
        let query = supabase.from('user_profiles').select('id, email, full_name');

        if (target.category === 'owners') {
            query = query.eq('role', 'owner');
        } else if (target.category === 'renters') {
            query = query.eq('role', 'renter');
        } else if (target.category === 'affiliates') {
            query = query.eq('role', 'affiliate');
        } else if (target.category === 'selected' && target.userIds) {
            query = query.in('id', target.userIds);
        }

        const { data: users, error: usersError } = await query;
        if (usersError) return handleServerError(usersError, "Failed to fetch target users");
        if (!users || users.length === 0) return { success: true, data: { count: 0 } };

        const results = {
            successCount: 0,
            failCount: 0,
            details: [] as any[]
        };

        // 3. Process each user
        for (const user of users) {
            let userSuccess = true;
            const errors: string[] = [];

            // A. Send Email via Resend
            if (channels.email && user.email) {
                try {
                    await resend.emails.send({
                        from: "GuruCrafts Agency <support@gurucrafts.agency>",
                        to: user.email,
                        subject: content.subject,
                        html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                                <h1 style="color: #333; font-size: 18px;">Hello ${user.full_name || 'User'},</h1>
                                <p style="color: #555; line-height: 1.6;">${content.message.replace(/\n/g, '<br/>')}</p>
                                <p style="color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                                    Regards,<br/>GuruCrafts Agency Team
                                </p>
                               </div>`,
                    });
                } catch (e: any) {
                    console.error(`Email failed for ${user.email}:`, e);
                    errors.push(`Email: ${e.message}`);
                    userSuccess = false;
                }
            }

            // B. Send In-App Notification
            if (channels.notification) {
                const { error: notifError } = await supabase
                    .from('notifications')
                    .insert({
                        user_id: user.id,
                        type: 'admin_broadcast',
                        title: content.subject,
                        message: content.message,
                        is_read: false
                    });

                if (notifError) {
                    console.error(`Notification failed for ${user.id}:`, notifError);
                    errors.push(`Notification: ${notifError.message}`);
                    userSuccess = false;
                }
            }

            // C. Send Direct Message (Messaging Page)
            if (channels.message) {
                try {
                    // Find or create conversation without a listing
                    // We check if a conversation already exists between admin and user where listing_id is null
                    const { data: existingConv } = await supabase
                        .from('conversations')
                        .select('id')
                        .is('listing_id', null)
                        .or(`participant_1_id.eq.${adminUser.id},participant_2_id.eq.${adminUser.id}`)
                        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
                        .maybeSingle();

                    let conversationId: string;

                    if (existingConv) {
                        conversationId = existingConv.id;
                    } else {
                        // Create new conversation
                        const { data: newConv, error: convError } = await supabase
                            .from('conversations')
                            .insert({
                                participant_1_id: adminUser.id,
                                participant_2_id: user.id,
                                listing_id: null
                            })
                            .select()
                            .single();

                        if (convError) throw convError;
                        conversationId = newConv.id;
                    }

                    // Insert message
                    const { error: msgError } = await supabase
                        .from('messages')
                        .insert({
                            conversation_id: conversationId,
                            sender_id: adminUser.id,
                            receiver_id: user.id,
                            content: content.message,
                            is_read: false
                        });

                    if (msgError) throw msgError;

                    // Update last message timestamp
                    await supabase
                        .from('conversations')
                        .update({ last_message_at: new Date().toISOString() })
                        .eq('id', conversationId);

                } catch (e: any) {
                    console.error(`Message failed for ${user.id}:`, e);
                    errors.push(`Message: ${e.message}`);
                    userSuccess = false;
                }
            }

            if (userSuccess) {
                results.successCount++;
            } else {
                results.failCount++;
                results.details.push({ user: user.full_name || user.email, errors });
            }
        }

        revalidatePath('/admin/communications');
        return {
            success: results.failCount === 0,
            data: {
                totalProcessed: users.length,
                successCount: results.successCount,
                failCount: results.failCount,
                errors: results.details
            }
        };

    } catch (error) {
        return handleServerError(error, "An unexpected error occurred during bulk communication");
    }
}
