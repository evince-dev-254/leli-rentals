"use server"

import { supabase } from "@/lib/supabase"
import { supabaseAdmin } from "@/lib/supabase-admin"

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
    const { data: existingAffiliate, error: findError } = await supabaseAdmin
        .from('affiliates')
        .select('*')
        .or(`user_id.eq.${userId},email.eq.${email}`)
        .single();

    if (existingAffiliate) {
        // Already exists, just ensure role is updated and return success
        // Update user role to affiliate if not already
        await supabaseAdmin
            .from('user_profiles')
            .update({ role: 'affiliate' })
            .eq('id', userId);

        return { success: true, data: existingAffiliate };
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
