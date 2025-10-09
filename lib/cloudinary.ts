import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drtjczrsl',
  api_key: process.env.CLOUDINARY_API_KEY || '746675165345341',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'HoG_jecxLqK8ZaVgwxTTGiq9Nq4',
  secure: true
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  bytes: number
}

export interface CloudinaryUploadOptions {
  folder?: string
  transformation?: any
  tags?: string[]
  moderation?: string
  quality?: string | number
  format?: string
}

// Server-side upload function for owners
export const uploadToCloudinary = async (
  file: Buffer | string,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    const uploadOptions = {
      folder: options.folder || 'leli-rentals',
      transformation: options.transformation,
      tags: options.tags,
      moderation: options.moderation || 'webpurify',
      quality: options.quality || 'auto',
      format: options.format || 'auto',
      resource_type: 'auto' as const
    }

    const result = await cloudinary.uploader.upload(file, uploadOptions)
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Upload multiple files for property listings
export const uploadMultipleToCloudinary = async (
  files: (Buffer | string)[],
  folder: string,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult[]> => {
  try {
    const uploadPromises = files.map((file, index) => 
      uploadToCloudinary(file, {
        ...options,
        folder: `${folder}/image_${index + 1}`,
        tags: [...(options.tags || []), 'property-listing']
      })
    )

    const results = await Promise.all(uploadPromises)
    return results
  } catch (error) {
    console.error('Multiple Cloudinary upload error:', error)
    throw new Error(`Multiple upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Generate optimized image URL with transformations
export const getOptimizedImageUrl = (
  publicId: string,
  transformations: any = {}
): string => {
  const defaultTransformations = {
    quality: 'auto',
    format: 'auto',
    width: 800,
    height: 600,
    crop: 'fill',
    gravity: 'auto'
  }

  const finalTransformations = { ...defaultTransformations, ...transformations }
  
  return cloudinary.url(publicId, {
    transformation: finalTransformations,
    secure: true
  })
}

// Generate thumbnail URL
export const getThumbnailUrl = (publicId: string, size: number = 300): string => {
  return cloudinary.url(publicId, {
    transformation: {
      width: size,
      height: size,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      format: 'auto'
    },
    secure: true
  })
}

// Generate responsive image URLs for different screen sizes
export const getResponsiveImageUrls = (publicId: string) => {
  return {
    thumbnail: getThumbnailUrl(publicId, 150),
    small: getOptimizedImageUrl(publicId, { width: 400, height: 300 }),
    medium: getOptimizedImageUrl(publicId, { width: 800, height: 600 }),
    large: getOptimizedImageUrl(publicId, { width: 1200, height: 900 }),
    original: cloudinary.url(publicId, { secure: true })
  }
}

export default cloudinary
