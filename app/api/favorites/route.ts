import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { addToFavorites, removeFromFavorites } from '@/lib/favorites'

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { listingId } = await request.json()

        if (!listingId) {
            return NextResponse.json(
                { success: false, error: 'Listing ID is required' },
                { status: 400 }
            )
        }

        const result = await addToFavorites(userId, listingId)

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in favorites POST:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { listingId } = await request.json()

        if (!listingId) {
            return NextResponse.json(
                { success: false, error: 'Listing ID is required' },
                { status: 400 }
            )
        }

        const result = await removeFromFavorites(userId, listingId)

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in favorites DELETE:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
