import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const documentFront = formData.get('documentFront') as File
    const documentBack = formData.get('documentBack') as File
    const selfieWithDocument = formData.get('selfieWithDocument') as File

    if (!documentFront || !documentBack || !selfieWithDocument) {
      return NextResponse.json(
        { error: 'All documents are required (front, back, and selfie)' },
        { status: 400 }
      )
    }

    // Upload documents to Cloudinary
    const [frontResult, backResult, selfieResult] = await Promise.all([
      uploadToCloudinary(
        Buffer.from(await documentFront.arrayBuffer()),
        { folder: 'verifications', tags: ['verification', 'id-front'] }
      ),
      uploadToCloudinary(
        Buffer.from(await documentBack.arrayBuffer()),
        { folder: 'verifications', tags: ['verification', 'id-back'] }
      ),
      uploadToCloudinary(
        Buffer.from(await selfieWithDocument.arrayBuffer()),
        { folder: 'verifications', tags: ['verification', 'selfie'] }
      ),
    ])

    // Save document URLs to Clerk metadata
    const client = await clerkClient()
    const user = await client.users.getUser(userId)

    await client.users.updateUser(userId, {
      unsafeMetadata: {
        ...user.unsafeMetadata,
        verificationStatus: 'pending',
        verificationSubmittedAt: new Date().toISOString(),
        verificationDocuments: {
          documentFront: frontResult.secure_url,
          documentBack: backResult.secure_url,
          selfieWithDocument: selfieResult.secure_url,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Documents uploaded successfully',
      documents: {
        documentFront: frontResult.secure_url,
        documentBack: backResult.secure_url,
        selfieWithDocument: selfieResult.secure_url,
      },
    })
  } catch (error) {
    console.error('Error uploading verification documents:', error)
    return NextResponse.json(
      { error: 'Failed to upload documents' },
      { status: 500 }
    )
  }
}

