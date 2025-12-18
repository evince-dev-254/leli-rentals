'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get role and ref from URL params (passed during signup)
                const roleParam = searchParams.get('role')
                const refCode = searchParams.get('ref')

                // Check if we have a hash fragment (implicit flow - used by Supabase OAuth)
                let accessToken = null
                let refreshToken = null

                if (typeof window !== 'undefined') {
                    const hashParams = new URLSearchParams(window.location.hash.substring(1))
                    accessToken = hashParams.get('access_token')
                    refreshToken = hashParams.get('refresh_token')
                }

                console.log('Client-side callback details:', {
                    fullUrl: typeof window !== 'undefined' ? window.location.href : '',
                    role: roleParam,
                    ref: refCode
                })

                if (accessToken && refreshToken) {
                    // Set the session using the tokens from the hash
                    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    })

                    if (sessionError) {
                        console.error('Error setting session:', sessionError)
                        setError('Failed to authenticate. Please try again.')
                        setTimeout(() => router.push('/sign-in'), 2000)
                        return
                    }

                    const user = sessionData.user
                    console.log('Session set successfully:', user?.email)

                    // Sync profile using server action (safe from RLS issues)
                    const { syncUserProfile } = await import('@/lib/actions/auth-actions')
                    const result = await syncUserProfile(
                        user!.id,
                        user!.email!,
                        user?.user_metadata || {},
                        roleParam || undefined,
                        refCode || null
                    )

                    if (!result.success) {
                        console.error('Error syncing profile:', result.error)
                        setError(`Failed to set up profile: ${result.error}`)
                        return
                    }

                    const userRole = result.profile?.role || 'renter'
                    console.log('Profile synced successfully. Role:', userRole)

                    // Redirect based on role
                    let redirectUrl = '/categories'

                    switch (userRole) {
                        case 'owner':
                            redirectUrl = '/dashboard/owner'
                            break
                        case 'affiliate':
                            redirectUrl = '/dashboard/affiliate'
                            break
                        case 'admin':
                            redirectUrl = '/admin'
                            break
                        case 'renter':
                        default:
                            redirectUrl = '/categories'
                            break
                    }

                    console.log('Redirecting to:', redirectUrl)
                    router.push(redirectUrl)
                    return
                }

                // If no hash params, check for code (PKCE flow)
                const code = searchParams.get('code')

                if (code) {
                    console.log('Found code parameter, exchanging for session...')
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                    if (exchangeError) {
                        console.error('Code exchange error:', exchangeError)
                        setError('Authentication failed. Please try again.')
                        setTimeout(() => router.push('/sign-in'), 2000)
                        return
                    }

                    // After successful exchange, redirect to dashboard
                    router.push('/dashboard')
                    return
                }

                // No tokens or code found
                console.log('No authentication data found, redirecting to sign-in')
                setError('No authentication data received.')
                setTimeout(() => router.push('/sign-in'), 2000)

            } catch (error) {
                console.error('Callback error:', error)
                setError('An unexpected error occurred.')
                setTimeout(() => router.push('/sign-in'), 2000)
            }
        }

        handleCallback()
    }, [router, searchParams])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                {error ? (
                    <>
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Authentication Error</h2>
                        <p className="text-gray-600 dark:text-gray-300">{error}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Redirecting...</p>
                    </>
                ) : (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Completing sign in...</h2>
                        <p className="text-gray-600 dark:text-gray-300">Please wait while we set up your account</p>
                    </>
                )}
            </div>
        </div>
    )
}
