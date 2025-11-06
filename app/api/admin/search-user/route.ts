import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { addCorsHeaders, createOptionsResponse } from '@/lib/admin-cors'

export async function OPTIONS(req: NextRequest) {
  return createOptionsResponse(req)
}

export async function POST(req: NextRequest) {
  try {
    const { email, emailAddress } = await req.json()

    // Support both 'email' and 'emailAddress' for backward compatibility
    const emailToSearch = email || emailAddress

    if (!emailToSearch) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailToSearch)) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 })
    }

    // Check authentication
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clerkClient()
    
    // Search for user by email address
    const { data: users } = await client.users.getUserList({ 
      emailAddress: [emailToSearch.toLowerCase().trim()],
      limit: 10 
    })

    // Find exact match
    const foundUser = users.find(user => {
      // Check primary email addresses
      if (user.emailAddresses && user.emailAddresses.length > 0) {
        return user.emailAddresses.some(email => 
          email.emailAddress.toLowerCase() === emailToSearch.toLowerCase().trim()
        )
      }
      return false
    })

    if (!foundUser) {
      return NextResponse.json({ 
        success: false,
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
    
    return addCorsHeaders(response, req)

  } catch (error: any) {
    console.error('User search error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 })
  }
}

