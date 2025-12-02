'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
    folder: 'profiles' | 'listings' | 'verifications'
    onUploadComplete: (result: {
        fileId: string
        url: string
        thumbnailUrl: string
        name: string
        filePath: string
    }) => void
    onUploadError?: (error: string) => void
    maxSizeMB?: number
    acceptedFormats?: string[]
    className?: string
    preview?: boolean
}

export function ImageUpload({
    folder,
    onUploadComplete,
    onUploadError,
    maxSizeMB = 5,
    acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
    className,
    preview = true
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!acceptedFormats.includes(file.type)) {
            onUploadError?.(`Please select a valid image format: ${acceptedFormats.join(', ')}`)
            return
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > maxSizeMB) {
            onUploadError?.(`File size must be less than ${maxSizeMB}MB`)
            return
        }

        // Show preview
        if (preview) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }

        // Upload to ImageKit
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('folder', folder)

            const response = await fetch('/api/imagekit/upload', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Upload failed')
            }

            const result = await response.json()
            onUploadComplete(result)
        } catch (error: any) {
            console.error('Upload error:', error)
            onUploadError?.(error.message || 'Failed to upload image')
            setPreviewUrl(null)
        } finally {
            setUploading(false)
        }
    }

    const clearPreview = () => {
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className={cn('space-y-4', className)}>
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.join(',')}
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
            />

            {previewUrl ? (
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-primary/20"
                    />
                    {!uploading && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={clearPreview}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    )}
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-48 border-2 border-dashed hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        {uploading ? (
                            <>
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="h-8 w-8" />
                                <span>Click to upload image</span>
                                <span className="text-xs">
                                    Max {maxSizeMB}MB • {acceptedFormats.map(f => f.split('/')[1]).join(', ')}
                                </span>
                            </>
                        )}
                    </div>
                </Button>
            )}
        </div>
    )
}
