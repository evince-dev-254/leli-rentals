import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user to check admin status
    const client = await clerkClient()
    // TEMPORARILY DISABLED FOR DEVELOPMENT - Allow all authenticated users
    // const currentUser = await client.users.getUser(userId)
    
    // const isAdmin = currentUser.publicMetadata?.role === 'admin' || 
    //                (currentUser.unsafeMetadata as any)?.role === 'admin'
    
    // if (!isAdmin) {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    // }

    // Fetch all users (paginated)
    const { data: users, totalCount } = await client.users.getUserList({ 
      limit: 500,
      orderBy: '-created_at'
    })

    // Return simplified user data
    const simplifiedUsers = users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses: user.emailAddresses,
      phoneNumbers: user.phoneNumbers,
      createdAt: user.createdAt,
      unsafeMetadata: user.unsafeMetadata,
      publicMetadata: user.publicMetadata,
    }))

    return NextResponse.json({
      success: true,
      users: simplifiedUsers,
      totalCount
    })

  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

