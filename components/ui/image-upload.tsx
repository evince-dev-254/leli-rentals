"use client"

import { useState, useId } from "react"
import { IKContext, IKUpload } from "imagekitio-react"
import { Loader2, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

const authenticator = async () => {
    try {
        const response = await fetch("/api/imagekit/auth")
        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Request failed with status ${response.status}: ${errorText}`)
        }
        const data = await response.json()
        const { signature, expire, token } = data
        return { signature, expire, token }
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`)
    }
}

interface ImageUploadProps {
    onSuccess: (res: any) => void
    onError: (err: any) => void
    folder?: string
    className?: string
    buttonText?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    maxSizeMB?: number
}

export function ImageUpload({
    onSuccess,
    onError,
    folder = "/uploads",
    className = "",
    buttonText = "Upload Image",
    variant = "outline",
    maxSizeMB = 10
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const uniqueId = useId()

    const onUploadStart = () => {
        setUploading(true)
    }

    const handleSuccess = (res: any) => {
        setUploading(false)
        onSuccess(res)
    }

    const handleError = (err: any) => {
        console.error("Upload Error:", err)
        setUploading(false)
        onError(err)
    }

    // Generate a secure, unique ID for this instance
    const uploadId = `imagekit-upload-${uniqueId}`

    return (
        <IKContext
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <div className={`relative flex items-center gap-2 ${className}`}>
                {uploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

                {/* Helper to hide the default input but keep functionality */}
                <div className="hidden">
                    <IKUpload
                        id={uploadId}
                        fileName="upload.png"
                        folder={folder}
                        validateFile={(file: File) => file.size < maxSizeMB * 1024 * 1024} // Dynamic Limit
                        onUploadStart={onUploadStart}
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                </div>

                <label htmlFor={uploadId}>
                    <div className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer ${variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' :
                        variant === 'default' ? 'bg-primary text-primary-foreground hover:bg-primary/90' :
                            'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        {uploading ? "Uploading..." : buttonText}
                    </div>
                </label>
            </div>
        </IKContext>
    )
}
