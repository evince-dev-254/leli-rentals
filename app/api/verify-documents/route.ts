import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    await client.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        verificationStatus: 'approved',
        isVerified: true,
        verificationSubmittedAt: new Date().toISOString(),
        verificationApprovedAt: new Date().toISOString(),
        documentsUploaded: true,
        needsVerification: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating verification:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

