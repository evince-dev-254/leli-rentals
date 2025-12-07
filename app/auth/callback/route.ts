import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type') as EmailOtpType | null
    const next = requestUrl.searchParams.get('next') || '/dashboard'
    const roleParam = requestUrl.searchParams.get('role')

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let sessionData = null
    let error = null

    // Method 1: OAuth or PKCE Code Exchange
    if (code) {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        sessionData = data
        error = exchangeError
    }
    // Method 2: Magic Link Token Hash (PKCE)
    else if (token_hash && type) {
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash,
            type,
        })
        sessionData = data
        error = verifyError
    }

    if (error) {
        console.error('Auth error:', error)
        return NextResponse.redirect(new URL('/sign-in?error=auth_failed', request.url))
    }

    if (sessionData?.user) {
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', sessionData.user.id)
            .single()

        // If no profile exists, handle creation (fallback if trigger failed)
        if (profileError || !profile) {
            // Check metadata passed during signup
            const metadata = sessionData.user.user_metadata || {}

            // Handle Referral Logic
            const refCode = requestUrl.searchParams.get('ref') || metadata.ref_code
            if (refCode) {
                try {
                    // Find affiliate by invite code (case insensitive likely, but let's assume direct match or uppercase)
                    const { data: affiliate } = await supabase
                        .from('affiliates')
                        .select('id')
                        .eq('invite_code', refCode) // Assuming ref param IS the invite code
                        .single()

                    if (affiliate) {
                        await supabase
                            .from('affiliate_referrals')
                            .insert({
                                affiliate_id: affiliate.id,
                                referred_user_id: sessionData.user.id,
                                commission_amount: 0,
                                commission_status: 'pending'
                            })
                    }
                } catch (e) {
                    console.error('Error processing referral:', e)
                }
            }

            await supabase.from('user_profiles').insert({
                id: sessionData.user.id,
                user_id: sessionData.user.id, // Explicitly add user_id
                email: sessionData.user.email!,
                full_name: metadata.full_name || metadata.name || '',
                phone: metadata.phone || null,
                role: roleParam || metadata.role || 'renter',
                avatar_url: metadata.avatar_url || metadata.picture || '',
            })

            // If we just created the profile, maybe we need to redirect to role select if role is missing?
            // But our new signup flow enforces role selection.
        }

        const role = profile?.role || sessionData.user.user_metadata?.role || 'renter'

        let redirectUrl = getRoleRedirect(role)

        // If a specific 'next' param was provided (and isn't just the default), use that
        if (next && next !== '/dashboard') {
            redirectUrl = next
        }

        return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Default redirect if no code/hash but somehow reached here (unlikely without params)
    return NextResponse.redirect(new URL('/sign-in', request.url))
}

function getRoleRedirect(role: string): string {
    switch (role) {
        case 'renter':
            return '/categories'
        case 'owner':
            return '/dashboard/owner'
        case 'affiliate':
            return '/dashboard/affiliate'
        case 'admin':
            return '/dashboard/admin'
        default:
            return '/categories'
    }
}
