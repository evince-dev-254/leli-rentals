"use client"

import { useState } from "react"
import { usePaystackPayment } from "react-paystack"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function TestPayment() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [amount, setAmount] = useState("1")
    const [loading, setLoading] = useState(false)

    const config = {
        reference: `TEST-${new Date().getTime()}`,
        email: email,
        amount: Number(amount) * 100, // Convert to kobo (1 KES = 100 kobo)
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        metadata: {
            custom_fields: [
                {
                    display_name: "Test Payment",
                    variable_name: "test_payment",
                    value: "true"
                }
            ]
        }
    }

    const initializePayment = usePaystackPayment(config)

    const onSuccess = (reference: any) => {
        console.log("Payment successful:", reference)
        setLoading(false)
        router.push(`/payment/success?reference=${reference.reference}`)
    }

    const onClose = () => {
        console.log("Payment closed")
        setLoading(false)
    }

    const handlePayment = () => {
        if (!email || !amount) {
            alert("Please fill in all fields")
            return
        }

        setLoading(true)
        initializePayment({ onSuccess, onClose })
    }

    return (
        <Card className="p-6 max-w-md">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Test Payment</h3>
                    <p className="text-sm text-muted-foreground">Paystack Integration Test</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="test@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1.5"
                    />
                </div>

                <div>
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <Input
                        id="amount"
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Minimum: 1 KES (100 kobo)
                    </p>
                </div>

                <Button
                    onClick={handlePayment}
                    disabled={loading || !email || !amount}
                    className="w-full"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay {amount} KES
                        </>
                    )}
                </Button>

                <div className="bg-muted/50 rounded-lg p-4 text-xs space-y-2">
                    <p className="font-semibold">Test Card Details:</p>
                    <div className="space-y-1 text-muted-foreground">
                        <p>Card Number: <code className="bg-background px-1 py-0.5 rounded">5531886652142950</code></p>
                        <p>CVV: <code className="bg-background px-1 py-0.5 rounded">564</code></p>
                        <p>Expiry: <code className="bg-background px-1 py-0.5 rounded">09/32</code></p>
                        <p>PIN: <code className="bg-background px-1 py-0.5 rounded">3310</code></p>
                        <p>OTP: <code className="bg-background px-1 py-0.5 rounded">123456</code></p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
