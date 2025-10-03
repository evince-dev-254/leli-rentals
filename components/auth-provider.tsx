"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthContext } from '@/lib/auth-context'
import { getRedirectUrl, getUserAccountType } from '@/lib/account-type-utils'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()
  const [hasRedirected, setHasRedirected] = useState(false)

  // Handle redirect after authentication - only if router is available
  useEffect(() => {
    if (!isLoading && user && !hasRedirected) {
      console.log('Auth Provider: User authenticated, checking redirect needs')

      // Small delay to ensure localStorage is accessible
      setTimeout(() => {
        setHasRedirected(true)
        try {
          const accountType = getUserAccountType()
          const redirectUrl = getRedirectUrl(accountType)
          console.log('Auth Provider: Redirecting to:', redirectUrl, 'for account type:', accountType)
          if (pathname !== redirectUrl) {
            router.push(redirectUrl)
          }
        } catch (error) {
          console.warn('Auth Provider: Could not redirect:', error)
        }
      }, 200)
    } else if (!isLoading && !user) {
      setHasRedirected(false)
    }
  }, [isLoading, user, hasRedirected, router, pathname])

  return <>{children}</>
}
