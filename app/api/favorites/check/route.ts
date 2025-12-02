import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isFavorite } from '@/lib/favorites'

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { isFavorite: false },
                { status: 200 }
            )
        }

        const { searchParams } = new URL(request.url)
        const listingId = searchParams.get('listingId')

        if (!listingId) {
            return NextResponse.json(
                { error: 'Listing ID is required' },
                { status: 400 }
            )
        }

        const favorited = await isFavorite(userId, listingId)

        return NextResponse.json({ isFavorite: favorited })
    } catch (error) {
        console.error('Error checking favorite status:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
