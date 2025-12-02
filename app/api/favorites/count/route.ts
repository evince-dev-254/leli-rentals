import { NextRequest, NextResponse } from 'next/server'
import { getFavoriteCount } from '@/lib/favorites'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const listingId = searchParams.get('listingId')

        if (!listingId) {
            return NextResponse.json(
                { error: 'Listing ID is required' },
                { status: 400 }
            )
        }

        const count = await getFavoriteCount(listingId)

        return NextResponse.json({ count })
    } catch (error) {
        console.error('Error fetching favorite count:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
