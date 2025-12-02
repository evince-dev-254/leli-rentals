import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { deleteFromImageKit } from '@/lib/imagekit'

export async function DELETE(req: NextRequest) {
    try {
        // Verify user is authenticated
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(req.url)
        const fileId = searchParams.get('fileId')

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            )
        }

        // Delete from ImageKit
        await deleteFromImageKit(fileId)

        return NextResponse.json({
            success: true,
            message: 'File deleted successfully',
        })
    } catch (error: any) {
        console.error('Error deleting from ImageKit:', error)
        return NextResponse.json(
            { error: 'Failed to delete file', details: error.message },
            { status: 500 }
        )
    }
}
