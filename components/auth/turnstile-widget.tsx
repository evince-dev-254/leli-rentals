"use client"

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface TurnstileWidgetProps {
    onSuccess: (token: string) => void
    onError?: () => void
    onExpire?: () => void
}

export const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileWidgetProps>(
    ({ onSuccess, onError, onExpire }, ref) => {
        const innerRef = useRef<TurnstileInstance>(null)

        useImperativeHandle(ref, () => innerRef.current!)

        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"

        return (
            <div className="flex justify-center" style={{ minHeight: '65px' }}>
                <Turnstile
                    ref={innerRef}
                    siteKey={siteKey}
                    onSuccess={onSuccess}
                    onError={onError}
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
