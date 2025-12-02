// ImageKit Configuration
export const imagekitConfig = {
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
}

// Folder structure for different image types
export const imagekitFolders = {
    profiles: '/profiles',
    listings: '/listings',
    verifications: '/verifications',
    thumbnails: '/thumbnails',
}

// Default transformation settings
export const defaultTransformations = {
    profile: {
        width: 200,
        height: 200,
        crop: 'at_max',
        focus: 'face',
    },
    listingThumbnail: {
        width: 400,
        height: 300,
        crop: 'at_max',
    },
    listingFull: {
        width: 1200,
        height: 900,
        quality: 80,
    },
    verification: {
        quality: 90,
        format: 'jpg',
    },
}

// Validate ImageKit configuration
export function validateImageKitConfig() {
    if (!imagekitConfig.urlEndpoint) {
        throw new Error('NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not set')
    }
    if (!imagekitConfig.publicKey) {
        throw new Error('NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY is not set')
    }
    if (!imagekitConfig.privateKey) {
        throw new Error('IMAGEKIT_PRIVATE_KEY is not set')
    }
    return true
}
