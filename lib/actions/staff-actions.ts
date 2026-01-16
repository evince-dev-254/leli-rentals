"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"

import { revalidatePath } from "next/cache"

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
            .eq('is_advertiser', true)

        // Fetch counts for staff (team)
        const { count: staffCount, error: staffError } = await supabaseAdmin
            .from('user_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('is_staff', true)

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

/** Fetch all staff for Admin Management bypassing RLS */
export async function getAdminStaffData() {
    try {
        const { data, error } = await supabaseAdmin
            .from("user_profiles")
            .select("*")
            .eq('role', 'staff')
            .order('created_at', { ascending: false });

        if (error) throw error
        return { success: true, data: data || [] }
    } catch (error) {
        console.error("Error fetching admin staff data:", error)
        return { success: false, error: "Failed to fetch staff" }
    }
}

export async function promoteToStaff(email: string) {
    try {
        const { data: user, error: findError } = await supabaseAdmin
            .from("user_profiles")
            .select("id, full_name")
            .eq("email", email)
            .single()

        if (findError || !user) throw new Error("User not found")

        const { error: updateError } = await supabaseAdmin
            .from("user_profiles")
            .update({
                role: "staff",
                is_staff: true
            })
            .eq("id", user.id)

        if (updateError) throw updateError

        revalidatePath("/admin/staff")
        return { success: true, message: `${user.full_name} promoted to staff` }
    } catch (error: any) {
        console.error("Error promoting to staff:", error)
        return { success: false, error: error.message || "Failed to promote user" }
    }
}

export async function requestStaffAccess(userId: string) {
    try {
        const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({ role: "staff_pending" })
            .eq("id", userId)

        if (error) throw error

        revalidatePath("/select-role")
        return { success: true, message: "Staff access requested successfully" }
    } catch (error: any) {
        console.error("Error requesting staff access:", error)
        return { success: false, error: error.message || "Failed to request access" }
    }
}

export async function getPendingStaffRequests() {
    try {
        const { data, error } = await supabaseAdmin
            .from("user_profiles")
            .select("*")
            .eq('role', 'staff_pending')
            .order('created_at', { ascending: false });

        if (error) throw error
        return { success: true, data: data || [] }
    } catch (error) {
        console.error("Error fetching pending staff requests:", error)
        return { success: false, error: "Failed to fetch requests" }
    }
}

export async function rejectStaffRequest(userId: string) {
    try {
        const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({ role: "renter" })
            .eq("id", userId)

        if (error) throw error

        revalidatePath("/admin/staff")
        return { success: true, message: "Staff request rejected" }
    } catch (error) {
        console.error("Error rejecting staff request:", error)
        return { success: false, error: "Failed to reject request" }
    }
}

export async function demoteFromStaff(userId: string) {
    try {
        const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({ role: "renter" })
            .eq("id", userId)

        if (error) throw error

        revalidatePath("/admin/staff")
        return { success: true, message: "Staff member demoted to renter" }
    } catch (error) {
        console.error("Error demoting from staff:", error)
        return { success: false, error: "Failed to demote staff member" }
    }
}
