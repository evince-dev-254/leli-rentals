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

type UserCategory = 'all' | 'owners' | 'renters' | 'affiliates' | 'selected' | 'broadcast' | 'owners_only' | 'renters_only' | 'affiliates_only' | 'individual';

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
            .select('role, is_admin')
            .eq('id', adminUser.id)
            .single();

        if (!adminProfile?.is_admin && adminProfile?.role !== 'admin') {
            return handleServerError("Unauthorized: Admin access required");
        }

        // 2. Resolve Target Users
        let users: any[] = []

        if (target.category === 'all' || target.category === 'broadcast') {
            const { data } = await supabase.from('user_profiles').select('id, email, full_name')
            users = data || []
        } else if (target.category === 'owners' || target.category === 'owners_only') {
            const { data } = await supabase.from('user_profiles').select('id, email, full_name').eq('role', 'owner')
            users = data || []
        } else if (target.category === 'renters' || target.category === 'renters_only') {
            const { data } = await supabase.from('user_profiles').select('id, email, full_name').eq('role', 'renter')
            users = data || []
        } else if (target.category === 'affiliates' || target.category === 'affiliates_only') {
            const { data } = await supabase.from('user_profiles').select('id, email, full_name').eq('role', 'affiliate')
            users = data || []
        } else if (target.category === 'selected' && target.userIds) {
            const { data } = await supabase.from('user_profiles').select('id, email, full_name').in('id', target.userIds)
            users = data || []
        } else if (target.category === 'individual' && (target as any).userId) {
            const { data } = await supabase.from('user_profiles').select('id, email, full_name').eq('id', (target as any).userId)
            users = data || []
        }

        if (users.length === 0) {
            return { success: true, data: { count: 0, message: "No users found for the selected target audience" } };
        }

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
                    console.log(`[DEBUG] Attempting to send email to: ${user.email} from updates@updates.leli.rentals`);
                    const emailResult = await resend.emails.send({
                        from: 'Leli Rentals <updates@updates.leli.rentals>',
                        to: user.email,
                        subject: content.subject,
                        html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Leli Rentals Update</h2>
          <div style="padding: 20px; background: #f9fafb; border-radius: 8px;">
            ${content.message.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            You received this email because you are a registered user on Leli Rentals.
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Leli Rentals. All rights reserved.
          </p>
        </div>
      `,
                    });
                    console.log(`[DEBUG] Resend result for ${user.email}:`, JSON.stringify(emailResult));
                } catch (e: any) {
                    console.error(`[ERROR] Email failed for ${user.email}:`, e);
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

/**
 * Fetches platform-wide notifications for admin view
 */
export async function getPlatformNotifications(limit = 50): Promise<ActionResponse> {
    const supabase = getAdminSupabase();

    try {
        const { data, error } = await supabase
            .from('notifications')
            .select(`
                *,
                user_profiles:user_id (full_name, email, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        return handleServerError(error, "Failed to fetch platform notifications");
    }
}

/**
 * Fetches recent platform-wide messages for admin view
 */
export async function getPlatformMessages(limit = 50): Promise<ActionResponse> {
    const supabase = getAdminSupabase();

    try {
        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:sender_id (full_name, email, avatar_url),
                receiver:receiver_id (full_name, email, avatar_url),
                conversation:conversation_id (listing_id)
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        return handleServerError(error, "Failed to fetch platform messages");
    }
}

/**
 * Deletes a platform notification (Admin only)
 */
export async function deletePlatformNotification(id: string): Promise<ActionResponse> {
    const supabase = getAdminSupabase();

    try {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/communications');
        return { success: true };
    } catch (error) {
        return handleServerError(error, "Failed to delete notification");
    }
}

/**
 * Deletes a platform message (Admin only)
 */
export async function deletePlatformMessage(id: string): Promise<ActionResponse> {
    const supabase = getAdminSupabase();

    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/communications');
        return { success: true };
    } catch (error) {
        return handleServerError(error, "Failed to delete message");
    }
}


