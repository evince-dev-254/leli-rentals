"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { resend } from "@/lib/resend"
import MissYouEmail from "@/components/emails/miss-you-email"
import VerificationReminderEmail from "@/components/emails/verification-reminder-email"

export async function sendInactivityReminders() {
    try {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // Find users inactive for > 30 days who haven't been reminded in > 30 days (or ever)
        const { data: inactiveUsers, error } = await supabaseAdmin
            .from('user_profiles')
            .select('id, email, full_name, last_inactivity_reminder_at')
            .lt('last_login_at', thirtyDaysAgo.toISOString())
            .or(`last_inactivity_reminder_at.is.null,last_inactivity_reminder_at.lt.${thirtyDaysAgo.toISOString()}`)
            .limit(50) // Batch processing

        if (error) throw error

        console.log(`[Reminders] Found ${inactiveUsers?.length || 0} inactive users`)

        let sentCount = 0

        for (const user of inactiveUsers || []) {
            if (!user.email) continue

            const { error: emailError } = await resend.emails.send({
                from: 'Leli Rentals <updates@updates.leli.rentals>',
                to: user.email,
                subject: 'We miss you at Leli Rentals!',
                react: MissYouEmail({ userFirstname: user.full_name?.split(' ')[0] || 'there' })
            })

            if (!emailError) {
                await supabaseAdmin
                    .from('user_profiles')
                    .update({ last_inactivity_reminder_at: new Date().toISOString() })
                    .eq('id', user.id)
                sentCount++
            }
        }

        return { success: true, count: sentCount }
    } catch (error) {
        console.error('Error sending inactivity reminders:', error)
        return { success: false, error }
    }
}

export async function sendVerificationReminders() {
    try {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        // Find OWNERS who need verification reminder
        // 1. Role must be 'owner'
        // 2. Must not have verified documents (This part requires a join or separate check usually, but for simplicity/perf in server actions we can iterate or use a simpler query if schema allows)
        // For now, let's fetch owners who haven't been reminded recently

        const { data: owners, error } = await supabaseAdmin
            .from('user_profiles')
            .select('id, email, full_name')
            .eq('role', 'owner')
            .or(`last_verification_reminder_at.is.null,last_verification_reminder_at.lt.${sevenDaysAgo.toISOString()}`)
            .limit(50)

        if (error) throw error

        let sentCount = 0

        for (const user of owners || []) {
            if (!user.email) continue

            // Check if they are already verified or have pending docs
            const { data: docs } = await supabaseAdmin
                .from('verification_documents')
                .select('status')
                .eq('user_id', user.id)
                .eq('status', 'approved')
                .maybeSingle()

            // If they have an approved doc, skip them
            if (docs) continue

            // Also check for pending? The user phrasing was "send verification documents", implying they haven't done it.
            // If they have pending, maybe we don't nag them yet? 
            // Let's check for ANY docs. If they have none or all rejected, we send.
            const { data: anyDocs } = await supabaseAdmin
                .from('verification_documents')
                .select('status')
                .eq('user_id', user.id)
                .in('status', ['pending', 'approved'])
                .limit(1)

            if (anyDocs && anyDocs.length > 0) continue; // They have pending or approved docs

            const { error: emailError } = await resend.emails.send({
                from: 'Leli Rentals <onboarding@updates.leli.rentals>',
                to: user.email,
                subject: 'Complete your verification to start hosting',
                react: VerificationReminderEmail({ userFirstname: user.full_name?.split(' ')[0] || 'Partner' })
            })

            if (!emailError) {
                await supabaseAdmin
                    .from('user_profiles')
                    .update({ last_verification_reminder_at: new Date().toISOString() })
                    .eq('id', user.id)
                sentCount++
            }
        }

        return { success: true, count: sentCount }
    } catch (error) {
        console.error('Error sending verification reminders:', error)
        return { success: false, error }
    }
}
