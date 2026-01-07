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

            if (user) {
                // Sync profile
                await syncUserProfile(
                    user.id,
                    user.email!,
                    user.user_metadata || {},
                    role || undefined,
                    ref || null
                )
            }

            // Determine redirect URL
            let redirectPath = '/categories'
            if (role === 'owner') redirectPath = '/dashboard/owner'
            else if (role === 'affiliate') redirectPath = '/dashboard/affiliate'
            else if (role === 'admin') redirectPath = '/admin'

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
            } else {
                return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
            }
        } else {
            console.error('Auth Callback Error:', error)
        }
    }

    // Auth failed or no code, redirect to login with error
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
}
