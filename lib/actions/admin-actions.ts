"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"
import { resend } from "@/lib/resend"
import WelcomeEmail from "@/components/emails/welcome-email" // Fallback template for generic messages if needed, or we just send text

// Helper to check for Super Admin status
async function checkSuperAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized: No session found")
    }

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("is_super_admin")
        .eq("id", user.id)
        .single()

    if (!profile?.is_super_admin) {
        throw new Error("Unauthorized: Super Admin privileges required")
    }

    return user
}

export async function toggleSuperAdmin(targetUserId: string) {
    try {
        await checkSuperAdmin()

        // Get current status
        const { data: profile, error: fetchError } = await supabaseAdmin
            .from("user_profiles")
            .select("is_super_admin")
            .eq("id", targetUserId)
            .single()

        if (fetchError) throw fetchError

        // Toggle
        const { error: updateError } = await supabaseAdmin
            .from("user_profiles")
            .update({ is_super_admin: !profile.is_super_admin })
            .eq("id", targetUserId)

        if (updateError) throw updateError

        revalidatePath("/admin/users")
        return { success: true, isSuperAdmin: !profile.is_super_admin }
    } catch (error: any) {
        console.error("Error toggling super admin:", error)
        return { success: false, error: error.message }
    }
}

export async function suspendUsers(userIds: string[]) {
    try {
        await checkSuperAdmin()
        const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({ account_status: "suspended" })
            .in("id", userIds)

        if (error) throw error
        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error suspending users:", error)
        return { success: false, error: "Failed to suspend users" }
    }
}

export async function reactivateUsers(userIds: string[]) {
    try {
        await checkSuperAdmin()
        const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({ account_status: "active" })
            .in("id", userIds)

        if (error) throw error
        revalidatePath("/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error reactivating users:", error)
        return { success: false, error: "Failed to reactivate users" }
    }
}

export async function deleteUsers(userIds: string[]) {
    try {
        await checkSuperAdmin()
        console.log(`[deleteUsers] Starting deletion for ${userIds.length} users...`)

        for (const userId of userIds) {
            // 1. Manually clean up key dependent data to ensure no FK violations prevent auth deletion
            // Cleanup bookings where user is involved
            await supabaseAdmin.from("bookings").delete().or(`renter_id.eq.${userId},owner_id.eq.${userId}`)

            // Cleanup reviews by the user or on their listings
            await supabaseAdmin.from("reviews").delete().eq("reviewer_id", userId)

            // Cleanup listings (this should cascade to any remaining reviews/bookings if configured)
            await supabaseAdmin.from("listings").delete().eq("owner_id", userId)

            // Cleanup auxiliary tables
            await supabaseAdmin.from("notifications").delete().eq("user_id", userId)
            await supabaseAdmin.from("verification_documents").delete().eq("user_id", userId)
            await supabaseAdmin.from("affiliates").delete().eq("user_id", userId)
            await supabaseAdmin.from("referrals").delete().or(`referrer_id.eq.${userId},referred_user_id.eq.${userId}`)
            await supabaseAdmin.from("support_tickets").delete().eq("user_id", userId)
            await supabaseAdmin.from("transactions").delete().eq("user_id", userId)

            // 2. Delete from auth.users - this will cascade to user_profiles
            const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
            if (authError) {
                console.error(`[deleteUsers] Error deleting auth user ${userId}:`, authError)
                throw authError
            }
        }

        revalidatePath("/admin/users")
        revalidatePath("/admin/staff")
        return { success: true }
    } catch (error: any) {
        console.error("Error deleting users:", error)
        return { success: false, error: error.message || "Failed to delete users" }
    }
}

export async function sendBulkReminders(userIds: string[], subject: string, message: string) {
    try {
        // Fetch emails for the selected users
        const { data: users, error } = await supabaseAdmin
            .from("user_profiles")
            .select("id, email, full_name")
            .in("id", userIds)

        if (error) throw error

        const notifications = []

        // Send emails and prepare notifications
        for (const user of users) {
            // 1. Send Email
            const { data: emailData, error: emailError } = await resend.emails.send({
                from: "Leli Rentals <updates@updates.leli.rentals>",
                to: user.email,
                subject: subject,
                html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Leli Rentals Update</h2>
          <div style="padding: 20px; background: #f9fafb; border-radius: 8px;">
            ${message.replace(/\n/g, "<br>")}
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
            })
            if (emailError) throw emailError

            // 2. Prepare database notification
            notifications.push({
                user_id: user.id,
                type: "admin_reminder",
                title: subject,
                message: message,
                is_read: false
            })
        }

        // Insert notifications
        if (notifications.length > 0) {
            const { error: notifError } = await supabaseAdmin
                .from("notifications")
                .insert(notifications)

            if (notifError) throw notifError
        }

        return { success: true, count: users.length }
    } catch (error) {
        console.error("Error sending bulk reminders:", error)
        return { success: false, error: "Failed to send reminders" }
    }
}

export async function getUserDetails(userId: string) {
    try {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from("user_profiles")
            .select("*, is_super_admin")
            .eq("id", userId)
            .single()

        if (profileError) throw profileError

        // Fetch verification documents ONLY if owner
        let verificationDocs = null
        if (profile.role === "owner") {
            const { data: docs } = await supabaseAdmin
                .from("verification_documents")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })

            verificationDocs = docs || []
        }

        // Fetch listings if owner
        let listings = null
        if (profile.role === "owner") {
            const { data: listingsData } = await supabaseAdmin
                .from("listings")
                .select("id, title, status, created_at, price_per_day, images")
                .eq("owner_id", userId)
                .order("created_at", { ascending: false })
                .limit(10)

            listings = listingsData || []
        }

        // Fetch bookings (as renter or owner)
        const { data: bookingsAsRenter } = await supabaseAdmin
            .from("bookings")
            .select("id, status, created_at, total_amount, listing:listings(title)")
            .eq("renter_id", userId)
            .order("created_at", { ascending: false })
            .limit(10)

        const { data: bookingsAsOwner } = await supabaseAdmin
            .from("bookings")
            .select("id, status, created_at, total_amount, listing:listings(title)")
            .eq("owner_id", userId)
            .order("created_at", { ascending: false })
            .limit(10)

        // Fetch referrals if affiliate
        let referrals = null
        if (profile.role === "affiliate") {
            const { data: referralsData } = await supabaseAdmin
                .from("referrals")
                .select(`
                    *,
                    referred_user:user_profiles!referrals_referred_user_id_fkey(id, full_name, email, role)
                `)
                .eq("referrer_id", userId)
                .order("created_at", { ascending: false })

            referrals = referralsData || []
        }

        return {
            success: true,
            data: {
                profile,
                verificationDocs,
                listings,
                bookingsAsRenter: bookingsAsRenter || [],
                bookingsAsOwner: bookingsAsOwner || [],
                referrals
            }
        }
    } catch (error) {
        console.error("Error fetching user details:", error)
        return { success: false, error: "Failed to fetch user details" }
    }
}

export async function getAdminPayments() {
    try {
        // Fetch payments
        const { data: payments, error: paymentsError } = await supabaseAdmin
            .from("payments")
            .select(`
                *,
                user_profiles(full_name, email),
                bookings(
                    id,
                    listings(title)
                )
            `)
            .order("created_at", { ascending: false })
            .limit(100)

        if (paymentsError) {
            console.error("Supabase error fetching payments:", paymentsError)
            throw paymentsError
        }

        // Fetch subscriptions
        const { data: subscriptions, error: subscriptionsError } = await supabaseAdmin
            .from("subscriptions")
            .select(`
                *,
                user_profiles(full_name, email, avatar_url)
            `)
            .order("created_at", { ascending: false })
            .limit(100)

        if (subscriptionsError) {
            console.error("Supabase error fetching subscriptions:", subscriptionsError)
            throw subscriptionsError
        }

        return {
            success: true,
            payments: payments || [],
            subscriptions: subscriptions || []
        }
    } catch (error: any) {
        console.error("Error fetching admin payments details:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
        })
        return { success: false, error: error.message || "Failed to fetch payments" }
    }
}

export async function resetDatabase() {
    try {
        console.log('[resetDatabase] Starting database reset...')

        // 1. Get current auth user to ensure they are admin and to preserve them
        // Using session-aware client for authentication
        const adminUser = await checkSuperAdmin()
        console.log('[resetDatabase] Super Admin authenticated:', { id: adminUser.id, email: adminUser.email })

        console.log('[resetDatabase] Admin verification passed. Proceeding with reset...')

        // 3. User is authorized. Now use supabaseAdmin (Service Role) for destructive data operations.

        // 4. Identify all users EXCEPT admins (to avoid locking out the requester and other admins)
        const { data: allUsers, error: usersError } = await supabaseAdmin
            .from("user_profiles")
            .select("id, role, is_admin")

        if (usersError) throw usersError

        const nonAdminUserIds = allUsers
            .filter(u => !u.is_admin && u.role !== 'admin')
            .map(u => u.id)

        console.log('[resetDatabase] Found non-admin users to delete:', nonAdminUserIds.length)

        // 4. Delete Listings (cascades to Bookings, Reviews, Favorites, Conversations, Messages)
        // Note: Using a logic that allows deleting all rows (neq a non-existent UUID or just use range)
        const { error: listingsError } = await supabaseAdmin
            .from("listings")
            .delete()
            .neq("id", "00000000-0000-0000-0000-000000000000")

        if (listingsError) throw listingsError
        console.log('[resetDatabase] Deleted all listings')

        // 5. Delete Other Auxiliary data explicitly if cascade isn't perfect
        await supabaseAdmin.from("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000")
        await supabaseAdmin.from("notifications").delete().neq("id", "00000000-0000-0000-0000-000000000000")
        await supabaseAdmin.from("support_tickets").delete().neq("id", "00000000-0000-0000-0000-000000000000")
        await supabaseAdmin.from("affiliates").delete().neq("id", "00000000-0000-0000-0000-000000000000")
        await supabaseAdmin.from("verification_documents").delete().neq("id", "00000000-0000-0000-0000-000000000000")
        console.log('[resetDatabase] Deleted auxiliary data')

        // 6. Delete non-admin auth users (cascades to user_profiles)
        for (const userId of nonAdminUserIds) {
            try {
                const { error: delError } = await supabaseAdmin.auth.admin.deleteUser(userId)
                if (delError) console.error(`Failed to delete auth user ${userId}:`, delError)
            } catch (e) {
                console.error(`Exception deleting auth user ${userId}:`, e)
            }
        }
        console.log('[resetDatabase] Deleted non-admin users')

        revalidatePath("/")
        revalidatePath("/admin")
        revalidatePath("/admin/users")
        revalidatePath("/admin/listings")

        console.log('[resetDatabase] Database reset completed successfully')

        return { success: true }
    } catch (error: any) {
        console.error("[resetDatabase] Error resetting database:", error)
        console.error("[resetDatabase] Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name
        })
        return { success: false, error: error.message || "Failed to reset database" }
    }
}

export async function getAmISuperAdmin() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return false

        // Use supabaseAdmin to bypass RLS, ensuring we get the true value
        const { data: profile } = await supabaseAdmin
            .from("user_profiles")
            .select("is_super_admin")
            .eq("id", user.id)
            .single()

        return !!profile?.is_super_admin
    } catch (error) {
        console.error("Error checking super admin status:", error)
        return false
    }
}
