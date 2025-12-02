import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { targetUserId, email } = body

        // Get target user ID from email if provided
        let userToUpdate = targetUserId

        if (email && !targetUserId) {
            const users = await clerkClient.users.getUserList({ emailAddress: [email] })
            if (users.length === 0) {
                return NextResponse.json(
                    { error: 'User not found with that email' },
                    { status: 404 }
                )
            }
            userToUpdate = users[0].id
        }

        if (!userToUpdate) {
            return NextResponse.json(
                { error: 'User ID or email required' },
                { status: 400 }
            )
        }

        // Update user metadata to add admin role
        await clerkClient.users.updateUserMetadata(userToUpdate, {
            publicMetadata: {
                role: 'admin'
            }
        })

        return NextResponse.json({
            success: true,
            message: 'User granted admin access',
            userId: userToUpdate
        })

    } catch (error) {
        console.error('Error making user admin:', error)
        return NextResponse.json(
            { error: 'Failed to grant admin access' },
            { status: 500 }
        )
    }
}
