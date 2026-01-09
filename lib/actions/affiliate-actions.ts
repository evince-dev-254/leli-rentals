"use server"

import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { createServerClient } from '@supabase/ssr'

// ... existing joinAffiliateProgram ...

export async function getAllAffiliates() {
    const { data, error } = await supabaseAdmin
        .from('affiliates')
        .select(`
            *,
            user_profiles:user_id (
                full_name,
                email,
                avatar_url,
                account_status
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching all affiliates:', error)
        return []
    }

    return data
}


export async function joinAffiliateProgram(userId: string, email: string) {
    // 1. Check if affiliate already exists for this user or email
    // Use Admin client to check existence across all records
    const { data: existingAffiliate, error: findError } = await supabaseAdmin
        .from('affiliates')
        .select('*')
        .or(`user_id.eq.${userId},email.eq.${email}`)
        .maybeSingle(); // Use maybeSingle to avoid error if multiple (shouldn't happen with unique email) or none

    if (existingAffiliate) {
        // Record exists. Ensure it is linked to this user_id if it was just email-based
        if (existingAffiliate.user_id !== userId) {
            await supabaseAdmin
                .from('affiliates')
                .update({ user_id: userId, status: 'active' }) // Ensure active and linked
                .eq('id', existingAffiliate.id);
        }

        // Ensure user profile role is set to affiliate
        await supabaseAdmin
            .from('user_profiles')
            .update({ role: 'affiliate' })
            .eq('id', userId);

        // Return the affiliate data with the correct user_id
        return { success: true, data: { ...existingAffiliate, user_id: userId } };
    }

    // Generate codes
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const referralCode = `REF-${inviteCode}`;

    // Create affiliate record using Admin client to bypass RLS
    const { data, error } = await supabaseAdmin
        .from('affiliates')
        .insert({
            user_id: userId,
            email: email,
            invite_code: inviteCode,
            referral_code: referralCode,
            status: 'active', // Auto-activate
            commission_rate: 10.00
        })
        .select()
        .single();

    if (error) {
        console.error('Error joining affiliate program:', error);
        return { success: false, error: error.message };
    }

    // Ensure user role is affiliate
    const { error: roleError } = await supabaseAdmin
        .from('user_profiles')
        .update({ role: 'affiliate' })
        .eq('id', userId);

    if (roleError) {
        console.error('Error updating role:', roleError);
    }

    return { success: true, data };
}

export async function requestWithdrawal(
    userId: string,
    amount: number,
    paymentMethod: string,
    paymentDetails: any,
    role: string = 'affiliate'
) {
    try {
        // 1. Validate balance based on role
        let availableBalance = 0;

        if (role === 'affiliate') {
            const { data: affiliate } = await supabaseAdmin
                .from('affiliates')
                .select('pending_earnings')
                .eq('user_id', userId)
                .single()
            availableBalance = affiliate?.pending_earnings || 0;
        } else {
            // Owner balance calculation (Rental income - already withdrawn)
            // For now, we'll fetch completed bookings sum
            const { data: bookings } = await supabaseAdmin
                .from('bookings')
                .select('total_amount')
                .eq('owner_id', userId)
                .eq('status', 'completed');

            const totalEarnings = bookings?.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0) || 0;

            // Subtract already requested/paid payouts
            const { data: payouts } = await supabaseAdmin
                .from('payout_requests')
                .select('amount')
                .eq('user_id', userId)
                .in('status', ['pending', 'approved', 'paid']);

            const totalWithdrawn = payouts?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;
            availableBalance = totalEarnings - totalWithdrawn;
        }

        if (amount < 100) throw new Error("Minimum withdrawal is KES 100")
        if (amount > 10000) throw new Error("Maximum withdrawal is KES 10,000") // Increased for owners
        if (amount > availableBalance) throw new Error("Insufficient balance")

        // 2. Create Payout Request
        const { data: payout, error: insertError } = await supabaseAdmin
            .from('payout_requests')
            .insert({
                user_id: userId,
                amount,
                payment_method: paymentMethod,
                payment_details: paymentDetails,
                status: 'pending',
                role
            })
            .select()
            .single()

        if (insertError) throw insertError

        // 3. If affiliate, deduct from pending_earnings to prevent double withdrawal
        if (role === 'affiliate') {
            const { data: affiliate } = await supabaseAdmin
                .from('affiliates')
                .select('pending_earnings')
                .eq('user_id', userId)
                .single();

            await supabaseAdmin
                .from('affiliates')
                .update({
                    pending_earnings: (affiliate?.pending_earnings || 0) - amount
                })
                .eq('user_id', userId)
        }

        return { success: true, data: payout }

    } catch (e: any) {
        console.error('Withdrawal error:', e);
        return { success: false, error: e.message }
    }
}

import { ActionResponse, handleServerError } from '../error-handler';

export async function updatePaymentInfo(userId: string, paymentInfo: any): Promise<ActionResponse> {
    console.log(`[SERVER] updatePaymentInfo called for user: ${userId}`);
    try {
        // Use a fresh admin client to ensure env vars are read correctly in server context
        const adminSupabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                cookies: {
                    get(name: string) { return undefined },
                },
            }
        );

        // 1. Update user_profile
        const { error: profileError } = await adminSupabase
            .from('user_profiles')
            .update({ payment_info: paymentInfo })
            .eq('id', userId);

        if (profileError) {
            return handleServerError(profileError, "Failed to update profile payment information");
        }

        // 2. Update affiliate (if exists)
        const { error: affiliateError } = await adminSupabase
            .from('affiliates')
            .update({ payment_info: paymentInfo })
            .eq('user_id', userId);

        if (affiliateError) {
            console.error('[SERVER] Affiliate update error:', affiliateError);
            // We don't necessarily throw here if profile updated but affiliate doesn't exist
        }

        console.log(`[SERVER] updatePaymentInfo success for user: ${userId}`);
        return { success: true }
    } catch (e: any) {
        return handleServerError(e, "An unexpected error occurred while updating payment information");
    }
}

export async function getWithdrawalHistory(userId: string) {
    const { data, error } = await supabaseAdmin
        .from('payout_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching withdrawal history:', error)
        return []
    }
    return data
}

export async function getAffiliateReferralsAdmin(affiliateId: string) {
    const { data, error } = await supabaseAdmin
        .from('affiliate_referrals')
        .select(`
            *,
            referred_user:user_profiles!referred_user_id(
                full_name,
                email,
                avatar_url
            ),
            listing:listings(
                title
            )
        `)
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching affiliate referrals for admin:', error);
        return [];
    }

    return data;
}
