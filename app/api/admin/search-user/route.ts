import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { addCorsHeaders, createOptionsResponse } from '@/lib/admin-cors'

export async function OPTIONS(req: NextRequest) {
  return createOptionsResponse(req)
}

export async function POST(request: NextRequest) {
  try {
    const { emailAddress } = await request.json()

    if (!emailAddress) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailAddress)) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 })
    }

    // Admin authentication check
    // TODO: Get the current user from the request and verify they are admin
    // For now, this endpoint should only be called from the admin page which already checks
    // In production, you should add proper authentication here using Clerk's auth()

    const client = await clerkClient()
    
    // Search for user by email address
    const { data: users } = await client.users.getUserList({ 
      emailAddress: [emailAddress.toLowerCase().trim()],
      limit: 10 
    })

    // Find exact match
    const foundUser = users.find(user => {
      // Check primary email addresses
      if (user.emailAddresses && user.emailAddresses.length > 0) {
        return user.emailAddresses.some(email => 
          email.emailAddress.toLowerCase() === emailAddress.toLowerCase().trim()
        )
      }
      return false
    })

    if (!foundUser) {
      return NextResponse.json({ 
        error: 'User not found',
        message: 'No user found with this email address' 
      }, { status: 404 })
    }

    // Return user data
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        emailAddresses: foundUser.emailAddresses,
        phoneNumbers: foundUser.phoneNumbers,
        createdAt: foundUser.createdAt,
        unsafeMetadata: foundUser.unsafeMetadata,
        publicMetadata: foundUser.publicMetadata,
      }
    })
    
    return addCorsHeaders(response, request)

  } catch (error: any) {
    console.error('User search error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

