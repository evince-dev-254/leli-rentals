import { NextRequest, NextResponse } from 'next/server'
import { getUploadAuthParams } from '@/lib/imagekit'
import { auth } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
    try {
        // Verify user is authenticated
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Generate upload authentication parameters
        const authParams = getUploadAuthParams()

        return NextResponse.json({
            ...authParams,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        })
    } catch (error: any) {
        console.error('Error generating upload auth:', error)
        return NextResponse.json(
            { error: 'Failed to generate upload authentication', details: error.message },
            { status: 500 }
        )
    }
}
