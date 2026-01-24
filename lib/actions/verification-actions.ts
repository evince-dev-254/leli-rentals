"use server"

import { createServerClient } from "@supabase/ssr"
import { createClient } from "@/lib/supabase-server"
import { getAdminSupabase } from "@/lib/supabase-admin"
import { ActionResponse, handleServerError } from "@/lib/error-handler"
import { sendVerificationStatusEmail } from "./email-actions"

/** 
 * Fetch all data needed for the Admin Verifications Management panel 
 * Moved from dashboard-actions.ts 
 */
export async function getAdminVerificationsAppData() {
    // 1. Verify User is an Admin before proceeding
    const authSupabase = await createClient()
    const { data: { user } } = await authSupabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    const { data: profile } = await authSupabase
        .from('user_profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin && profile?.role !== 'admin') {
        throw new Error("Unauthorized: Admin access required")
    }

    // 2. Use Admin Client to fetch all data bypassing RLS
    const adminSupabase = getAdminSupabase()

    const [docsRes, listingsRes] = await Promise.all([
        adminSupabase.from('verification_documents').select('*'),
        adminSupabase.from('listings').select('*').eq('status', 'pending')
    ])

    if (docsRes.error) throw docsRes.error
    if (listingsRes.error) throw listingsRes.error

    const docs = docsRes.data || []
    const listings = listingsRes.data || []

    // 3. Collect all user IDs from docs and listings
    const userIds = Array.from(new Set([
        ...docs.map((d: any) => d.user_id),
        ...listings.map((l: any) => l.owner_id)
    ]))

    // 4. Fetch profiles for these users
    let users = []
    if (userIds.length > 0) {
        const { data, error: usersError } = await adminSupabase
            .from('user_profiles')
            .select('*')
            .in('id', userIds)

        if (usersError) throw usersError
        users = data || []
    }

    return {
        docs,
        listings,
        users
    }
}

/** 
 * Fetch a single verification document and related user data bypassing RLS 
 * Moved from dashboard-actions.ts
 */
export async function getAdminVerificationDetail(docId: string) {
    const authSupabase = await createClient()
    const { data: { user } } = await authSupabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    const { data: profile } = await authSupabase
        .from('user_profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin && profile?.role !== 'admin') {
        throw new Error("Unauthorized: Admin access required")
    }

    const adminSupabase = getAdminSupabase()

    const { data: doc, error: docError } = await adminSupabase
        .from("verification_documents")
        .select("*")
        .eq("id", docId)
        .single()

    if (docError) throw docError
    if (!doc) throw new Error("Document not found")

    const { data: userData, error: userError } = await adminSupabase
        .from("user_profiles")
        .select("*")
        .eq("id", doc.user_id)
        .single()

    if (userError) throw userError

    return {
        doc,
        user: userData
    }
}

/** 
 * Update Verification Document Status 
 * Moved from dashboard-actions.ts
 */
export async function updateDocumentStatus(docId: string, status: 'approved' | 'rejected', reason?: string) {
    const supabase = getAdminSupabase() // Use Admin Client to bypass RLS
    const updateData: any = { status };
    if (reason) updateData.rejection_reason = reason;

    // Update the document
    const { error } = await supabase
        .from('verification_documents')
        .update(updateData)
        .eq('id', docId);

    if (error) throw error;

    // ---------------------------------------------------------
    // Additional logic originally handled implicitly or needing explicit trigger
    // ---------------------------------------------------------

    // Fetch the doc to get the user ID
    const { data: doc } = await supabase
        .from('verification_documents')
        .select('user_id')
        .eq('id', docId)
        .single()

    if (doc && doc.user_id) {
        // Fetch user info for email
        const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('email, full_name, role')
            .eq('id', doc.user_id)
            .single()

        if (userProfile?.email) {
            // Send email notification
            await sendVerificationStatusEmail(
                userProfile.email,
                userProfile.full_name?.split(' ')[0] || 'User',
                status,
                reason
            )
        }

        // If Approved, update user profile verification status
        if (status === 'approved') {
            await supabase
                .from('user_profiles')
                .update({
                    verification_status: 'verified',
                    account_status: 'active', // Unsuspend if they were suspended
                    updated_at: new Date().toISOString()
                })
                .eq('id', doc.user_id)
        }
    }
}
