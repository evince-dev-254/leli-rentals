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
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const accessToken = hashParams.get('access_token')
                const refreshToken = hashParams.get('refresh_token')

                console.log('Client-side callback details:', {
                    fullUrl: window.location.href,
                    hash: window.location.hash,
                    search: window.location.search,
                    hasAccessToken: !!accessToken,
                    hasRefreshToken: !!refreshToken,
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

                    // Check if user has a profile
                    const { data: profile, error: profileError } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', user!.id)
                        .maybeSingle()

                    let userRole = roleParam || 'renter'

                    // If no profile exists, create one
                    if (profileError || !profile) {
                        console.log('Creating or updating profile with role:', userRole)

                        const metadata = user?.user_metadata || {}

                        // Create profile (upsert to handle race conditions)
                        const { error: insertError } = await supabase.from('user_profiles').upsert({
                            id: user!.id,
                            email: user!.email!,
                            full_name: metadata.full_name || metadata.name || user!.email?.split('@')[0] || '',
                            phone: metadata.phone || null,
                            role: userRole,
                            avatar_url: metadata.avatar_url || metadata.picture || '',
                            updated_at: new Date().toISOString(),
                        }, {
                            onConflict: 'id',
                            ignoreDuplicates: false,
                        })

                        if (insertError) {
                            console.error('Error creating profile:', insertError)
                            setError('Failed to create profile. Please contact support.')
                            return
                        }

                        // Handle referral if ref code exists
                        if (refCode) {
                            try {
                                const { data: affiliate } = await supabase
                                    .from('affiliates')
                                    .select('id')
                                    .eq('invite_code', refCode)
                                    .single()

                                if (affiliate) {
                                    await supabase.from('affiliate_referrals').insert({
                                        affiliate_id: affiliate.id,
                                        referred_user_id: user!.id,
                                        commission_amount: 0,
                                        commission_status: 'pending'
                                    })
                                }
                            } catch (e) {
                                console.error('Error processing referral:', e)
                            }
                        }

                        console.log('Profile created successfully')
                    } else {
                        // Profile exists, use its role
                        userRole = profile.role || userRole
                        console.log('Using existing profile role:', userRole)
                    }

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
