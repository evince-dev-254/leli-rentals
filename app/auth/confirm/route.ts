import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type') as EmailOtpType | null
    const next = requestUrl.searchParams.get('next') || '/dashboard'

    const supabase = await createClient()

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
        return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
    }

    if (sessionData?.user) {
        const { syncUserProfile } = await import('@/lib/actions/auth-actions')
        const result = await syncUserProfile(
            sessionData.user.id,
            sessionData.user.email!,
            sessionData.user.user_metadata || {},
            sessionData.user.user_metadata?.role || undefined
        )

        if (!result.success) {
            console.error('Error syncing profile in confirm route:', result.error)
            // Still redirect but maybe to a fallback
            return NextResponse.redirect(new URL('/categories', request.url))
        }

        const role = result.profile?.role || 'renter'
        const redirectUrl = getRoleRedirect(role)

        return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Default redirect if no code/hash but somehow reached here (unlikely without params)
    return NextResponse.redirect(new URL('/login', request.url))
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
