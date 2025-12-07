"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"

export async function registerUser({ email, password, data }: { email: string, password: string, data: any }) {
    try {
        // Use Admin API to create user without sending confirmation email
        const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: false, // User is NOT confirmed yet
            user_metadata: data
        })

        if (error) {
            console.error('Admin create user error:', error)
            return { success: false, error: error.message }
        }

        return { success: true, user: user.user }
    } catch (error: any) {
        console.error('Registration error:', error)
        return { success: false, error: error.message || 'Registration failed' }
    }
}
