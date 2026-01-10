"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function checkUserExists(email: string) {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) return { error: error.message }

    const exists = users.some(u => u.email === email)
    return { exists }
}

export async function syncUserProfile(userId: string, email: string, metadata: any, requestedRole?: string, refCode?: string | null) {
    try {
        // 1. Check if profile exists using admin client (bypasses RLS)
        const { data: profile, error: fetchError } = await supabaseAdmin
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle()

        if (fetchError) {
            console.error('Error fetching profile in syncUserProfile:', fetchError)
            return { success: false, error: fetchError.message }
        }

        if (profile) {
            console.log(`[syncUserProfile] Found existing profile for ${userId} with role ${profile.role}`)
            // Update last login
            await supabaseAdmin
                .from('user_profiles')
                .update({ last_login_at: new Date().toISOString() })
                .eq('id', userId)

            // If profile exists but has NO role (legacy or interrupted signup), and we have a requested role, update it
            if (!profile.role && requestedRole) {
                console.log(`[syncUserProfile] Updating role for ${userId} to ${requestedRole}`)
                await supabaseAdmin
                    .from('user_profiles')
                    .update({ role: requestedRole })
                    .eq('id', userId)

                profile.role = requestedRole
            }

            return { success: true, profile, exists: true }
        }

        // 2. Profile doesn't exist, create it
        console.log(`[syncUserProfile] Creating new profile for ${userId} (${email}) with role ${requestedRole || 'renter'}`)

        const role = requestedRole || null // Default to null for new users to force selection
        const profileData: any = {
            id: userId,
            email: email,
            full_name: metadata.full_name || metadata.name || email.split('@')[0],
            phone: metadata.phone || null,
            role: role,
            avatar_url: metadata.avatar_url || metadata.picture || '',
            last_login_at: new Date().toISOString()
        }

        const { data: newProfile, error: insertError } = await supabaseAdmin
            .from('user_profiles')
            .insert(profileData)
            .select()
            .single()

        if (insertError) {
            // Second attempt if schema mismatch
            if (insertError.message?.includes("column") || insertError.code === "42703") {
                const { last_login_at, ...legacyData } = profileData
                const { data: retryProfile, error: retryError } = await supabaseAdmin
                    .from('user_profiles')
                    .insert(legacyData)
                    .select()
                    .single()

                if (retryError) throw retryError
                // Handle referral if signup included one
                if (refCode) await handleReferral(userId, refCode)
                return { success: true, profile: retryProfile, exists: false }
            }
            throw insertError
        }

        // 3. Handle referral if ref code exists and it's a new user
        if (refCode) {
            await handleReferral(userId, refCode)
        }

        return { success: true, profile: newProfile, exists: false }
    } catch (e: any) {
        console.error('Exception in syncUserProfile:', e)
        return { success: false, error: e.message }
    }
}

async function handleReferral(referredUserId: string, refCode: string) {
    try {
        const { data: affiliate } = await supabaseAdmin
            .from('affiliates')
            .select('id, user_id')
            .eq('invite_code', refCode)
            .single()

        if (affiliate) {
            // Record the referral
            await supabaseAdmin.from('affiliate_referrals').insert({
                affiliate_id: affiliate.id,
                referred_user_id: referredUserId,
                commission_amount: 0,
                commission_status: 'pending'
            })

            // Label the referred user
            await supabaseAdmin
                .from('user_profiles')
                .update({
                    is_referred: true,
                    referred_by: affiliate.user_id
                })
                .eq('id', referredUserId)

            console.log(`[handleReferral] Referral recorded for user ${referredUserId} from affiliate ${affiliate.id}`)
        }
    } catch (e) {
        console.error('Error processing referral in handleReferral:', e)
    }
}
