import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('OAuth error:', error)
            return NextResponse.redirect(new URL('/signin?error=oauth_failed', request.url))
        }

        if (data.user) {
            // Check if user profile exists
            const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', data.user.id)
                .single()

            // If no profile exists, redirect to role selection
            if (profileError || !profile) {
                // Create basic profile
                await supabase.from('user_profiles').insert({
                    id: data.user.id,
                    email: data.user.email!,
                    full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
                    avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || '',
                    role: 'renter', // Default role
                })

                // Redirect to role selection page
                return NextResponse.redirect(new URL('/select-role', request.url))
            }

            // Profile exists, redirect based on role
            const redirectUrl = getRoleRedirect(profile.role)
            return NextResponse.redirect(new URL(redirectUrl, request.url))
        }
    }

    // Default redirect
    return NextResponse.redirect(new URL('/dashboard', request.url))
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
