"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"

// Deprecated: Password-based registration is removed.
// Keeping this file for potential future server-side auth operations if needed.

export async function checkUserExists(email: string) {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) return { error: error.message }

    const exists = users.some(u => u.email === email)
    return { exists }
}
