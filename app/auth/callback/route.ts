import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { syncUserProfile } from '@/lib/actions/auth-actions'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const role = requestUrl.searchParams.get('role')
    const ref = requestUrl.searchParams.get('ref')
    // Also check for hash params if processed by client and sent here? No, route handler sees full URL.
    // But hash params are not sent to server. Standard PKCE uses search params.

    if (code) {
        const supabase = await createClient()

        // Exchange the code for a session
        // The server client automatically handles the code_verifier from cookies
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Get the user after successful session exchange
            const { data: { user } } = await supabase.auth.getUser()

            let redirectPath = '/categories'

            if (user) {
                // Sync profile
                await syncUserProfile(
                    user.id,
                    user.email!,
                    user.user_metadata || {},
                    role || undefined,
                    ref || user.user_metadata?.ref_code || null
                )

                // Check if user has a role. If not (and not explicitly requesting one), redirect to selection
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role, is_admin, is_staff')
                    .eq('id', user.id)
                    .single()

                if (!role && (!profile || !profile.role)) {
                    redirectPath = '/select-role'
                }
                else if (role === 'owner' || profile?.role === 'owner') redirectPath = '/dashboard/owner'
                else if (role === 'affiliate' || profile?.role === 'affiliate') redirectPath = '/dashboard/affiliate'
                else if (role === 'admin' || profile?.is_admin || profile?.role === 'admin') redirectPath = '/admin'
                else if (role === 'staff' || profile?.is_staff || profile?.role === 'staff') redirectPath = '/admin'
            }

            const source = requestUrl.searchParams.get('source')

            // Mobile Bridge: If coming from mobile, redirect back to the app with tokens
            if (source === 'mobile') {
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    const params = new URLSearchParams({
                        access_token: session.access_token,
                        refresh_token: session.refresh_token,
                    })
                    return NextResponse.redirect(`leli-rentals://auth/callback?${params.toString()}`)
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
            } else {
                return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
            }
        } else {
            console.error('Auth Callback Error:', error)
            const source = requestUrl.searchParams.get('source')
            if (source === 'mobile') {
                return NextResponse.redirect(`leli-rentals://auth/callback?error=${encodeURIComponent(error.message)}`)
            }
        }
    }

    // Auth failed or no code, redirect to login with error
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
}
