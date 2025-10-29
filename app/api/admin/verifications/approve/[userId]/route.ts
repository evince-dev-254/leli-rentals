import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { automaticNotifications } from '@/lib/automatic-notifications'

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Update user verification status
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    await client.users.updateUser(userId, {
      unsafeMetadata: {
        ...user.unsafeMetadata,
        verificationStatus: 'approved',
        verificationApprovedAt: new Date().toISOString(),
      },
    })

    // Send approval email notification
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/emails/verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.emailAddresses[0]?.emailAddress,
          userName: user.firstName || 'there',
          status: 'approved'
        })
      })
    } catch (emailError) {
      console.error('Email notification error:', emailError)
      // Don't fail the approval if email fails
    }
    
    // Send in-app notification
    try {
      await automaticNotifications.sendVerificationNotification(
        userId,
        'approved'
      )
    } catch (notifError) {
      console.error('In-app notification error:', notifError)
      // Don't fail the approval if notification fails
    }

    return NextResponse.json({
      success: true,
      message: 'Verification approved successfully',
    })
  } catch (error) {
    console.error('Error approving verification:', error)
    return NextResponse.json(
      { error: 'Failed to approve verification' },
      { status: 500 }
    )
  }
}

