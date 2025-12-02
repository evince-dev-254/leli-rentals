'use client'

import { useState } from 'react'
import { ImageUpload, ProfileImage } from '@/components/imagekit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

/**
 * Example component demonstrating ImageKit integration
 * This shows how to upload and display profile pictures
 */
export default function ImageKitExample() {
    const { toast } = useToast()
    const [profileImage, setProfileImage] = useState<{
        fileId: string
        url: string
        filePath: string
    } | null>(null)

    const handleUploadComplete = async (result: any) => {
        setProfileImage({
            fileId: result.fileId,
            url: result.url,
            filePath: result.filePath
        })

        toast({
            title: 'Upload Successful',
            description: 'Your profile picture has been updated.',
        })

        // TODO: Save to database
        // await fetch('/api/user/profile', {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     profileImageId: result.fileId,
        //     profileImageUrl: result.url,
        //     profileImagePath: result.filePath
        //   })
        // })
    }

    const handleUploadError = (error: string) => {
        toast({
            title: 'Upload Failed',
            description: error,
            variant: 'destructive'
        })
    }

    const handleDelete = async () => {
        if (!profileImage) return

        try {
            const response = await fetch(`/api/imagekit/delete?fileId=${profileImage.fileId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Delete failed')

            setProfileImage(null)
            toast({
                title: 'Image Deleted',
                description: 'Your profile picture has been removed.',
            })
        } catch (error) {
            toast({
                title: 'Delete Failed',
                description: 'Failed to delete image. Please try again.',
                variant: 'destructive'
            })
        }
    }

    return (
        <div className="container mx-auto py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>ImageKit Integration Example</CardTitle>
                    <CardDescription>
                        Upload and display optimized images using ImageKit
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {profileImage ? (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <ProfileImage
                                    path={profileImage.filePath}
                                    alt="Profile Picture"
                                    size={200}
                                    className="border-4 border-primary/20 shadow-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    <strong>File ID:</strong> {profileImage.fileId}
                                </p>
                                <p className="text-sm text-muted-foreground break-all">
                                    <strong>URL:</strong> {profileImage.url}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <strong>Path:</strong> {profileImage.filePath}
                                </p>
                            </div>

                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className="w-full"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove Photo
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Upload a profile picture to see ImageKit in action. The image will be automatically optimized,
                                cropped to a circle, and focused on faces.
                            </p>

                            <ImageUpload
                                folder="profiles"
                                onUploadComplete={handleUploadComplete}
                                onUploadError={handleUploadError}
                                maxSizeMB={5}
                                acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                                preview={true}
                            />
                        </div>
                    )}

                    <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-2">Features Demonstrated:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>File upload with validation (size, format)</li>
                            <li>Preview before upload</li>
                            <li>Automatic image optimization</li>
                            <li>Face detection and circular cropping</li>
                            <li>Lazy loading with LQIP</li>
                            <li>File deletion</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
