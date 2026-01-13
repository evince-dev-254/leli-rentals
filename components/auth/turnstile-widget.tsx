"use client"

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'

interface TurnstileWidgetProps {
    onSuccess: (token: string) => void
    onError?: () => void
    onExpire?: () => void
}

export const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileWidgetProps>(
    ({ onSuccess, onError, onExpire }, ref) => {
        const innerRef = useRef<TurnstileInstance>(null)

        useImperativeHandle(ref, () => innerRef.current!)

        const [siteKey, setSiteKey] = useState<string>("1x00000000000000000000AA")

        useEffect(() => {
            // Determine the correct site key based on the environment
            // 1. Is it localhost?
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

            // 2. Is it a Vercel preview deployment?
            const isVercelPreview = window.location.hostname.includes('.vercel.app');

            if (process.env.NODE_ENV === 'production' && !isLocalhost && !isVercelPreview) {
                // ONLY use the real production key if we are on the REAL production domain (leli.rentals)
                // This prevents Error 110200 on Vercel Previews
                setSiteKey(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA");
            } else {
                // Use Test Key for Localhost AND Vercel Previews
                setSiteKey("1x00000000000000000000AA");
            }
        }, []);

        return (
            <div className="flex justify-center" style={{ minHeight: '65px' }}>
                <Turnstile
                    ref={innerRef}
                    siteKey={siteKey}
                    onSuccess={onSuccess}
                    onError={(err) => {
                        console.error("Turnstile Error:", err)
                        if (onError) onError()
                    }}
                    onExpire={onExpire}
                    options={{
                        theme: 'auto',
                        appearance: 'always',
                    }}
                />
            </div>
        )
    }
)

TurnstileWidget.displayName = "TurnstileWidget"
