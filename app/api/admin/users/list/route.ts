import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { addCorsHeaders, createOptionsResponse } from '@/lib/admin-cors'
import { verifyAdminRequest } from '@/lib/admin-auth'

export async function OPTIONS(req: NextRequest) {
  return createOptionsResponse(req)
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdminRequest(req)
    if (!authResult.ok) {
      const errorResponse = NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: authResult.status || 403 }
      )
      return addCorsHeaders(errorResponse, req)
    }

    // Fetch all users from Clerk
    const clerkUsers = await clerkClient.users.getUserList({
      limit: 500 // Adjust as needed
    })

    // Fetch user profiles from Supabase
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('*')

    // Create a map of Supabase profiles by user_id
    const profilesMap = new Map()
    profiles?.forEach(profile => {
      profilesMap.set(profile.user_id, profile)
    })

    // Merge Clerk users with Supabase profiles
    const mergedUsers = clerkUsers.map(clerkUser => {
      const profile = profilesMap.get(clerkUser.id)

      return {
        id: clerkUser.id,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'N/A',
        email: clerkUser.emailAddresses[0]?.emailAddress || 'N/A',
        accountType: (clerkUser.publicMetadata as any)?.accountType ||
          (clerkUser.unsafeMetadata as any)?.accountType ||
          profile?.account_type ||
          'renter',
        role: (clerkUser.publicMetadata as any)?.role ||
          (clerkUser.unsafeMetadata as any)?.role ||
          profile?.role,
        status: profile?.status || 'active',
        verificationStatus: profile?.verification_status,
        createdAt: clerkUser.createdAt,
        phone: profile?.phone,
        location: profile?.location
      }
    })

    const response = NextResponse.json({
      success: true,
      users: mergedUsers,
      total: mergedUsers.length
    })

    return addCorsHeaders(response, req)
  } catch (error: any) {
    console.error('Error fetching users:', error)
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    )
    return addCorsHeaders(errorResponse, req)
  }
}
