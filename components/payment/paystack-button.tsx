"use client"

import { Button } from '@/components/ui/button'
import { usePaystackPayment } from 'react-paystack'

interface PaystackPaymentProps {
    amount: number // in KES
    email: string
    phone?: string
    metadata?: any
    onSuccess?: (reference: any) => void
    onClose?: () => void
    text?: string
    className?: string
    subaccount?: string
    transactionCharge?: number // Platform fee in KES
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

    const config: any = {
        reference: (new Date()).getTime().toString(),
        email,
        amount: amount * 100, // Convert to cents
        publicKey,
        currency: 'KES',
        metadata: metadata || {},
        phone,
    };

    if (subaccount) {
        config.subaccount = subaccount;
        if (transactionCharge) {
            config.transaction_charge = transactionCharge * 100; // Convert to cents
        }
    }

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
