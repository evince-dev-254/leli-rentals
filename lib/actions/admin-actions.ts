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
            await resend.emails.send({
                from: "leli rentals <notifications@leli.rentals>",
                to: user.email,
                subject: subject,
                html: `<p>Hello ${user.full_name || 'User'},</p><p>${message}</p><p>Regards,<br/>Leli Rentals Team</p>`,
            })

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
