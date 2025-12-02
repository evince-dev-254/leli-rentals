'use client'

import { IKImage } from 'imagekitio-react'
import { imagekitConfig } from '@/lib/imagekit.config'

interface OptimizedImageProps {
    path: string
    alt: string
    width?: number
    height?: number
    className?: string
    transformation?: Array<Record<string, any>>
    loading?: 'lazy' | 'eager'
    lqip?: { active: boolean; quality?: number }
}

export function OptimizedImage({
    path,
    alt,
    width,
    height,
    className,
    transformation,
    loading = 'lazy',
    lqip = { active: true, quality: 20 }
}: OptimizedImageProps) {
    return (
        <IKImage
            urlEndpoint={imagekitConfig.urlEndpoint}
            path={path}
            alt={alt}
            width={width}
            height={height}
            className={className}
            transformation={transformation}
            loading={loading}
            lqip={lqip}
        />
    )
}

// Profile image with circular crop
export function ProfileImage({
    path,
    alt,
    size = 200,
    className
}: {
    path: string
    alt: string
    size?: number
    className?: string
}) {
    return (
        <OptimizedImage
            path={path}
            alt={alt}
            width={size}
            height={size}
            className={className}
            transformation={[
                {
                    width: size.toString(),
                    height: size.toString(),
                    crop: 'at_max',
                    focus: 'face',
                    radius: 'max'
                }
            ]}
        />
    )
}

// Listing thumbnail
export function ListingThumbnail({
    path,
    alt,
    className
}: {
    path: string
    alt: string
    className?: string
}) {
    return (
        <OptimizedImage
            path={path}
            alt={alt}
            width={400}
            height={300}
            className={className}
            transformation={[
                {
                    width: '400',
                    height: '300',
                    crop: 'at_max'
                }
            ]}
        />
    )
}

// Full listing image
export function ListingImage({
    path,
    alt,
    className
}: {
    path: string
    alt: string
    className?: string
}) {
    return (
        <OptimizedImage
            path={path}
            alt={alt}
            width={1200}
            height={900}
            className={className}
            transformation={[
                {
                    width: '1200',
                    height: '900',
                    quality: '80'
                }
            ]}
        />
    )
}
