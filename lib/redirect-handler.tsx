"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { getRedirectUrl, getUserAccountType } from '@/lib/account-type-utils'

export function RedirectHandler({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const isLoading = !isLoaded
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

          // Only redirect if we're not already on the target page
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
