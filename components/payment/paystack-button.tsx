"use client"

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'

// Use dynamic import for PaystackButton to avoid SSR issues
const PaystackButton = dynamic(
    () => import('react-paystack').then((mod) => mod.PaystackButton),
    { ssr: false }
)

interface PaystackPaymentProps {
    amount: number // in KES
    email: string
    metadata?: any
    onSuccess?: (reference: any) => void
    onClose?: () => void
    text?: string
    className?: string
}

export const PaystackPaymentButton = ({
    amount,
    email,
    metadata,
    onSuccess,
    onClose,
    text = "Pay Now",
    className
}: PaystackPaymentProps) => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ""

    if (!publicKey) {
        console.error("Paystack public key is missing")
        return <Button disabled variant="destructive">Configuration Error</Button>
    }

    const componentProps = {
        email,
        amount: amount * 100, // Convert to cents (KES)
        currency: 'KES', // Kenyan Shillings
        metadata: metadata || {},
        publicKey,
        text,
        onSuccess: (reference: any) => {
            if (onSuccess) onSuccess(reference)
        },
        onClose: () => {
            if (onClose) onClose()
        },
    }

    // We wrap it to style it or handle loading states if needed
    // PaystackButton renders a simple HTML button
    return (
        <div className={className}>
            <PaystackButton
                {...componentProps}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium flex items-center justify-center transition-colors"
            />
        </div>
    )
}
