import { NextRequest, NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { automaticNotifications } from '@/lib/automatic-notifications'
import { addCorsHeaders, createOptionsResponse } from '@/lib/admin-cors'

export async function OPTIONS(req: NextRequest) {
  return createOptionsResponse(req)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Update user verification status
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    // Check if documents are submitted
    const verificationDocuments = user.unsafeMetadata?.verificationDocuments as any
    if (!verificationDocuments || 
        !verificationDocuments.documentFront || 
        !verificationDocuments.documentBack || 
        !verificationDocuments.selfieWithDocument) {
      return NextResponse.json(
        { error: 'Cannot approve: User has not submitted all required verification documents' },
        { status: 400 }
      )
    }

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

    const response = NextResponse.json({
      success: true,
      message: 'Verification approved successfully',
    })
    
    return addCorsHeaders(response, req)
  } catch (error) {
    console.error('Error approving verification:', error)
    return NextResponse.json(
      { error: 'Failed to approve verification' },
      { status: 500 }
    )
  }
}

