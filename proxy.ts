import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/about',
  '/contact',
  '/help',
  '/listings(.*)',
  '/categories(.*)',
  '/items(.*)',
  '/privacy',
  '/terms',
  '/cookies',
  '/chat-privacy',
])

// Define owner-only routes
const isOwnerRoute = createRouteMatcher([
  '/dashboard/owner(.*)',
  '/list-item(.*)',
])

// Define admin-only routes
const isAdminRoute = createRouteMatcher([
  '/admin-panel(.*)',
  '/admin/verify-users(.*)',
  '/admin/dashboard(.*)',
  '/admin/analytics(.*)',
])

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId, redirectToSignIn, sessionClaims } = await auth()
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (isPublicRoute(request)) {
    return NextResponse.next()
  }

  // Redirect to sign-in if not authenticated
  if (!userId && !isPublicRoute(request)) {
    return redirectToSignIn()
  }

  // Check admin-only routes
  // TEMPORARILY DISABLED FOR DEVELOPMENT
  // if (isAdminRoute(request)) {
  //   const metadata = sessionClaims?.unsafeMetadata as any
  //   const publicMeta = sessionClaims?.publicMetadata as any
  //   const isAdmin = publicMeta?.role === 'admin' || metadata?.role === 'admin'

  //   if (!isAdmin) {
  //     // Redirect non-admins trying to access admin routes
  //     const unauthorizedUrl = new URL('/unauthorized', request.url)
  //     unauthorizedUrl.searchParams.set('reason', 'admin_only')
  //     return NextResponse.redirect(unauthorizedUrl)
  //   }
  // }

  // Check owner-only routes
  // TEMPORARILY DISABLED FOR DEVELOPMENT - Allow all authenticated users
  // if (isOwnerRoute(request)) {
  //   const metadata = sessionClaims?.unsafeMetadata as any
  //   const accountType = metadata?.accountType || request.cookies.get('userAccountType')?.value
  //   const verificationStatus = metadata?.verificationStatus || 'not_verified'

  //   if (accountType === 'renter') {
  //     // Redirect renters trying to access owner routes
  //     const switchUrl = new URL('/profile/switch-account', request.url)
  //     switchUrl.searchParams.set('required', 'owner')
  //     switchUrl.searchParams.set('redirect', pathname)
  //     return NextResponse.redirect(switchUrl)
  //   }

  //   // Only require verification if user is not already verified or pending
  //   // Once approved, they can access all owner routes freely
  //   if (accountType === 'owner' && 
  //       verificationStatus !== 'pending' && 
  //       verificationStatus !== 'approved' && 
  //       !pathname.includes('/verification')) {
  //     const verificationUrl = new URL('/verification', request.url)
  //     verificationUrl.searchParams.set('redirect', pathname)
  //     return NextResponse.redirect(verificationUrl)
  //   }
  // }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

