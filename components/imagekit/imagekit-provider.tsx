'use client'

import { IKContext } from 'imagekitio-react'
import { imagekitConfig } from '@/lib/imagekit.config'

interface ImageKitProviderProps {
    children: React.ReactNode
}

export function ImageKitProvider({ children }: ImageKitProviderProps) {
    const authenticator = async () => {
        try {
            const response = await fetch('/api/imagekit/upload-auth')

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

    return (
        <IKContext
            urlEndpoint={imagekitConfig.urlEndpoint}
            publicKey={imagekitConfig.publicKey}
            authenticator={authenticator}
        >
            {children}
        </IKContext>
    )
}
