import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { uploadToImageKit } from '@/lib/imagekit'

export async function POST(req: NextRequest) {
    try {
        // Verify user is authenticated
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const formData = await req.formData()
        const file = formData.get('file') as File
        const folder = formData.get('folder') as 'profiles' | 'listings' | 'verifications'
        const customFileName = formData.get('fileName') as string | null

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        if (!folder || !['profiles', 'listings', 'verifications'].includes(folder)) {
            return NextResponse.json(
                { error: 'Invalid folder specified' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to ImageKit
        const result = await uploadToImageKit({
            file: buffer,
            fileName: customFileName || file.name,
            folder,
            tags: [userId, folder],
            useUniqueFileName: true,
        })

        return NextResponse.json({
            success: true,
            ...result,
        })
    } catch (error: any) {
        console.error('Error uploading to ImageKit:', error)
        return NextResponse.json(
            { error: 'Failed to upload file', details: error.message },
            { status: 500 }
        )
    }
}
