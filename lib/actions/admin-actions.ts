"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { resend } from "@/lib/resend"
import WelcomeEmail from "@/components/emails/welcome-email" // Fallback template for generic messages if needed, or we just send text

export async function suspendUsers(userIds: string[]) {
    try {
        const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({ account_status: "suspended" })
            .in("id", userIds)

        if (error) throw error
        revalidatePath("/dashboard/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error suspending users:", error)
        return { success: false, error: "Failed to suspend users" }
    }
}

export async function reactivateUsers(userIds: string[]) {
    try {
        const { error } = await supabaseAdmin
            .from("user_profiles")
            .update({ account_status: "active" })
            .in("id", userIds)

        if (error) throw error
        revalidatePath("/dashboard/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error reactivating users:", error)
        return { success: false, error: "Failed to reactivate users" }
    }
}

export async function deleteUsers(userIds: string[]) {
    try {
        // Delete from auth.users - this will cascade to user_profiles due to FK constraint
        for (const userId of userIds) {
            const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
            if (error) throw error
        }

        revalidatePath("/dashboard/admin/users")
        return { success: true }
    } catch (error) {
        console.error("Error deleting users:", error)
        return { success: false, error: "Failed to delete users" }
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
            .select("*")
            .eq("id", userId)
            .single()

        if (profileError) throw profileError

        // Fetch verification documents if owner or affiliate
        let verificationDocs = null
        if (profile.role === "owner" || profile.role === "affiliate") {
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
                bookings(id, listing_title)
            `)
            .order("created_at", { ascending: false })
            .limit(100)

        if (paymentsError) throw paymentsError

        // Fetch subscriptions
        const { data: subscriptions, error: subscriptionsError } = await supabaseAdmin
            .from("subscriptions")
            .select(`
                *,
                user_profiles(full_name, email, avatar_url)
            `)
            .order("created_at", { ascending: false })
            .limit(100)

        if (subscriptionsError) throw subscriptionsError

        return {
            success: true,
            payments: payments || [],
            subscriptions: subscriptions || []
        }
    } catch (error) {
        console.error("Error fetching admin payments:", error)
        return { success: false, error: "Failed to fetch payments" }
    }
}
