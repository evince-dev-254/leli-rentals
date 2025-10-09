import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/lib/cloudinary'
import { auth } from '@/lib/firebase'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin if not already done
if (!auth) {
  console.error('Firebase Admin not initialized')
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    
    // Verify the Firebase token
    let decodedToken
    try {
      decodedToken = await getAuth().verifyIdToken(token)
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    // Check if user has owner permissions
    if (decodedToken.accountType !== 'owner') {
      return NextResponse.json(
        { error: 'Forbidden - Owner account required' },
        { status: 403 }
      )
    }

    // Parse the form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = formData.get('folder') as string || `properties/${decodedToken.uid}`
    const tags = formData.get('tags') as string || 'property-listing'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}` },
          { status: 400 }
        )
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Maximum size: 10MB` },
          { status: 400 }
        )
      }
    }

    // Convert files to buffers
    const fileBuffers = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        return Buffer.from(arrayBuffer)
      })
    )

    // Upload to Cloudinary
    const uploadResults = await uploadMultipleToCloudinary(
      fileBuffers,
      folder,
      {
        tags: [tags, 'owner-upload'],
        moderation: 'webpurify',
        quality: 'auto',
        format: 'auto'
      }
    )

    // Return the results
    return NextResponse.json({
      success: true,
      uploads: uploadResults.map(result => ({
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      })),
      count: uploadResults.length
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// Handle single file upload
export async function PUT(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]
    
    // Verify the Firebase token
    let decodedToken
    try {
      decodedToken = await getAuth().verifyIdToken(token)
    } catch (error) {
      console.error('Token verification failed:', error)
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    // Parse the form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || `profiles/${decodedToken.uid}`
    const tags = formData.get('tags') as string || 'profile-image'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large: ${file.name}. Maximum size: 5MB` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(fileBuffer, {
      folder,
      tags: [tags],
      moderation: 'webpurify',
      quality: 'auto',
      format: 'auto'
    })

    // Return the result
    return NextResponse.json({
      success: true,
      upload: {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes
      }
    })

  } catch (error) {
    console.error('Single upload API error:', error)
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
