import ImageKit from 'imagekit'
import { imagekitConfig, imagekitFolders, defaultTransformations } from './imagekit.config'

// Initialize ImageKit instance (server-side only)
let imagekit: ImageKit | null = null

export function getImageKitInstance() {
    if (!imagekit) {
        imagekit = new ImageKit({
            publicKey: imagekitConfig.publicKey,
            privateKey: imagekitConfig.privateKey,
            urlEndpoint: imagekitConfig.urlEndpoint,
        })
    }
    return imagekit
}

// Upload file to ImageKit
export async function uploadToImageKit({
    file,
    fileName,
    folder,
    tags = [],
    useUniqueFileName = true,
}: {
    file: Buffer | string
    fileName: string
    folder: 'profiles' | 'listings' | 'verifications'
    tags?: string[]
    useUniqueFileName?: boolean
}) {
    const ik = getImageKitInstance()

    const folderPath = imagekitFolders[folder]

    try {
        const result = await ik.upload({
            file,
            fileName,
            folder: folderPath,
            tags,
            useUniqueFileName,
        })

        return {
            fileId: result.fileId,
            url: result.url,
            thumbnailUrl: result.thumbnailUrl,
            name: result.name,
            filePath: result.filePath,
        }
    } catch (error) {
        console.error('ImageKit upload error:', error)
        throw error
    }
}

// Delete file from ImageKit
export async function deleteFromImageKit(fileId: string) {
    const ik = getImageKitInstance()

    try {
        await ik.deleteFile(fileId)
        return { success: true }
    } catch (error) {
        console.error('ImageKit delete error:', error)
        throw error
    }
}

// Generate ImageKit URL with transformations
export function getImageKitUrl(
    path: string,
    transformations?: Array<Record<string, any>>
) {
    const ik = getImageKitInstance()

    return ik.url({
        path,
        transformation: transformations,
    })
}

// Get optimized profile image URL
export function getOptimizedProfileImage(
    filePath: string,
    size: number = 200
) {
    return getImageKitUrl(filePath, [
        {
            width: size.toString(),
            height: size.toString(),
            crop: 'at_max',
            focus: 'face',
            radius: 'max', // Circular
        },
    ])
}

// Get optimized listing image URL
export function getOptimizedListingImage(
    filePath: string,
    type: 'thumbnail' | 'full' = 'thumbnail'
) {
    const transformation = type === 'thumbnail'
        ? defaultTransformations.listingThumbnail
        : defaultTransformations.listingFull

    return getImageKitUrl(filePath, [transformation])
}

// Get thumbnail from video
export function getVideoThumbnail(videoPath: string) {
    return getImageKitUrl(`${videoPath}/ik-thumbnail.jpg`, [
        {
            width: '400',
            height: '300',
        },
    ])
}

// Generate upload authentication parameters (server-side only)
export function getUploadAuthParams() {
    const ik = getImageKitInstance()

    return ik.getAuthenticationParameters()
}
