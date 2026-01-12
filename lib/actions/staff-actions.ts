"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function getStaffStats() {
    try {
        // Fetch counts for affiliates
        const { count: affiliatesCount, error: affError } = await supabaseAdmin
            .from('affiliates')
            .select('*', { count: 'exact', head: true })

        const { count: pendingAffiliatesCount, error: pendingAffError } = await supabaseAdmin
            .from('affiliates')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')

        const { count: activeAffiliatesCount, error: activeAffError } = await supabaseAdmin
            .from('affiliates')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active')

        // Fetch counts for owners (advertisers)
        const { count: ownersCount, error: ownersError } = await supabaseAdmin
            .from('user_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'owner')

        // Fetch counts for staff (team)
        const { count: staffCount, error: staffError } = await supabaseAdmin
            .from('user_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'staff')

        if (affError || pendingAffError || activeAffError || ownersError || staffError) {
            console.error('Error fetching staff stats:', { affError, pendingAffError, activeAffError, ownersError, staffError })
            throw new Error("Failed to fetch statistics")
        }

        return {
            totalAffiliates: affiliatesCount || 0,
            activeAffiliates: activeAffiliatesCount || 0,
            totalAdvertisers: ownersCount || 0,
            pendingApprovals: pendingAffiliatesCount || 0,
            totalStaff: staffCount || 0
        }
    } catch (error) {
        console.error('Exception in getStaffStats:', error)
        return {
            totalAffiliates: 0,
            activeAffiliates: 0,
            totalAdvertisers: 0,
            pendingApprovals: 0,
            totalStaff: 0
        }
    }
}

export async function getStaffTeam() {
    const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('role', 'staff')
        .order('full_name', { ascending: true })

    if (error) {
        console.error('Error fetching staff team:', error)
        return []
    }

    return data
}
