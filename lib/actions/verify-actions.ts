"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { resend } from "@/lib/resend"
import OtpEmail from "@/components/emails/otp-email"

export async function sendCustomOtp(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store code in user_profiles metadata or update a field
    // We can use a temporary table 'verifications' or just store in an allowed field.
    // Since we don't have a verifications table for this, let's use user_profiles 'phone' field as a hack? No.
    // Let's create a 'verification_code' column in user_profiles via SQL later.
    // For now, we'll store it in the user's app_metadata using Admin API which persists on auth.users.

    // OPTION: Update auth.users user_metadata (or app_metadata which is safer)

    // First, find user ID
    const { data: { users }, error: findError } = await supabaseAdmin.auth.admin.listUsers()
    if (findError) return { success: false, error: findError.message }

    const user = users.find(u => u.email === email)
    if (!user) return { success: false, error: "User not found" }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { user_metadata: { ...user.user_metadata, custom_otp: code, custom_otp_sent_at: new Date().toISOString() } }
    )

    if (updateError) return { success: false, error: updateError.message }

    // Send Email
    try {
        console.log(`[DEV ONLY] Generated OTP for ${email}: ${code}`); // Log for dev/sandbox use

        const data = await resend.emails.send({
            from: "Leli Rentals <onboarding@leli.rentals>",
            to: email,
            subject: "Your Verification Code",
            react: OtpEmail({ code }),
        })

        if (data.error) {
            console.error('Resend API Error:', data.error);
            // If it's the sandbox limitation, we still want to allow the flow if they can read the logs
            if (data.error.message?.includes("only send testing emails to your own email address")) {
                console.warn("⚠️ RESEND SANDBOX LIMITATION: You can only send to your verified email. The OTP has been logged above for your convenience.");
                // Return success so the UI moves to the OTP input step, allowing them to enter the code from the console
                return { success: true };
            }
            return { success: false, error: data.error.message }
        }

        return { success: true }
    } catch (err: any) {
        console.error('Email sending failed:', err);
        return { success: false, error: err.message }
    }
}

export async function verifyCustomOtp(email: string, code: string, password?: string, fullName?: string) {
    // Find user
    const { data: { users }, error: findError } = await supabaseAdmin.auth.admin.listUsers()
    if (findError) return { success: false, error: findError.message }

    const user = users.find(u => u.email === email)
    if (!user) return { success: false, error: "User not found" }

    const storedOtp = user.user_metadata?.custom_otp
    // const sentAt = user.user_metadata?.custom_otp_sent_at // Could check expiry

    if (storedOtp === code) {
        // Construct updates
        const updates: any = {
            email_confirm: true,
            user_metadata: { ...user.user_metadata, custom_otp: null }
        }

        // If password is provided, force update it (handles stale/existing user case)
        if (password) {
            updates.password = password
        }

        // Ensure full_name is set if provided
        if (fullName) {
            updates.user_metadata.full_name = fullName
        }

        // Confirm Email & Update Password!
        const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            updates
        )

        if (confirmError) return { success: false, error: confirmError.message }

        return { success: true }
    } else {
        return { success: false, error: "Invalid code" }
    }
}
