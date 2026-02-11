"use client"

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { usePaystackPayment } from 'react-paystack'
import { EXCHANGE_RATE, PAYMENT_CURRENCY } from '@/lib/constants'
// ... existing imports

interface PaystackPaymentProps {
    amount: number // in USD
    email: string
    phone?: string
    metadata?: any
    onSuccess?: (reference: any) => void
    onClose?: () => void
    text?: string
    className?: string
    subaccount?: string
    transactionCharge?: number // Platform fee in USD
}

export const PaystackPaymentButton = ({
    amount,
    email,
    phone,
    metadata,
    onSuccess,
    onClose,
    text = "Pay Now",
    className,
    subaccount,
    transactionCharge
}: PaystackPaymentProps) => {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ""

    // Store reference in state to persist across re-renders
    const [reference] = useState(() => (new Date()).getTime().toString())

    // Convert USD to the target payment currency (e.g. KES)
    const paymentAmount = (PAYMENT_CURRENCY as string) === 'USD' ? amount : amount * EXCHANGE_RATE

    const config = useMemo(() => {
        const baseConfig: any = {
            reference,
            email,
            amount: Math.round(paymentAmount * 100), // Convert to cents/kobo/shilling cents
            publicKey,
            currency: PAYMENT_CURRENCY,
            metadata: {
                ...metadata,
                original_amount: amount,
                original_currency: 'USD',
                exchange_rate: EXCHANGE_RATE
            },
            phone,
        };

        if (subaccount) {
            baseConfig.subaccount = subaccount;
            if (transactionCharge) {
                baseConfig.transaction_charge = transactionCharge * 100; // Convert to cents
            }
        }

        return baseConfig
    }, [reference, email, paymentAmount, publicKey, metadata, phone, subaccount, transactionCharge])

    const initializePayment = usePaystackPayment(config);

    if (!publicKey) {
        console.error("Paystack public key is missing")
        return <Button disabled variant="destructive">Configuration Error</Button>
    }

    return (
        <div className={className}>
            <Button
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium flex items-center justify-center transition-colors"
                onClick={() => {
                    initializePayment({
                        onSuccess: (reference: any) => {
                            if (onSuccess) onSuccess(reference)
                        },
                        onClose: () => {
                            if (onClose) onClose()
                        }
                    })
                }}
            >
                {text}
            </Button>
        </div>
    )
}
