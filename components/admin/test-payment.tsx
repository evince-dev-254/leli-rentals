"use client"

import { useState, useEffect } from "react"
import { usePaystackPayment } from "react-paystack"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CreditCard, AlertTriangle } from "lucide-react"
import { LeliLoader } from "@/components/ui/leli-loader"
import { useRouter } from "next/navigation"

export function TestPayment() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [amount, setAmount] = useState("100")
    const [loading, setLoading] = useState(false)
    const [isLiveMode, setIsLiveMode] = useState(false)
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: Number(amount) * 100, // Paystack expects kobo/cents
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        currency: 'KES',
        metadata: {
            custom_fields: [
                {
                    display_name: "Payment Mode",
                    variable_name: "payment_mode",
                    value: isLiveMode ? "live" : "test"
                },
                {
                    display_name: "Test Payment",
                    variable_name: "test_payment",
                    value: "true"
                }
            ]
        },
        subaccount: process.env.NEXT_PUBLIC_PAYSTACK_SUBACCOUNT_ID
    }

    const initializePayment = usePaystackPayment(paystackConfig)

    const handlePayment = () => {
        if (!isClient) {
            alert("Payment system loading, please wait...")
            return
        }

        if (!email || !amount || Number(amount) < 1) {
            alert("Please enter valid email and amount (min 1 KES)")
            return
        }

        setLoading(true)

        initializePayment({
            onSuccess: (reference: any) => {
                setLoading(false)
                router.push(`/payment/success?reference=${reference.reference}`)
            },
            onClose: () => {
                setLoading(false)
            }
        })
    }

    return (
        <Card className="p-6 max-w-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isLiveMode ? 'bg-green-500/10' : 'bg-primary/10'
                        }`}>
                        <CreditCard className={`h-6 w-6 ${isLiveMode ? 'text-green-500' : 'text-primary'}`} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Payment Test</h3>
                        <p className="text-sm text-muted-foreground">
                            {isLiveMode ? 'Live - Real Money' : 'Test - No Charge'}
                        </p>
                    </div>
                </div>
                <Badge variant={isLiveMode ? "default" : "secondary"} className={isLiveMode ? "bg-green-500" : ""}>
                    {isLiveMode ? "LIVE" : "TEST"}
                </Badge>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <Label htmlFor="live-mode" className="cursor-pointer">
                        {isLiveMode ? '🔴 Live Mode' : '🟡 Test Mode'}
                    </Label>
                    <Switch id="live-mode" checked={isLiveMode} onCheckedChange={setIsLiveMode} />
                </div>

                {isLiveMode && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                        <p className="text-xs text-red-600 dark:text-red-400">
                            <strong>Warning:</strong> This will charge real money!
                        </p>
                    </div>
                )}

                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
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
                        Minimum: 1 KES • Currency: Kenyan Shillings
                    </p>
                </div>

                <Button
                    onClick={handlePayment}
                    disabled={loading || !email || !amount || !isClient}
                    className="w-full"
                    size="lg"
                >
                    {loading ? (
                        <>
                            <LeliLoader size="sm" variant="white" className="mr-2" />
                            Processing...
                        </>
                    ) : !isClient ? (
                        <>
                            <LeliLoader size="sm" variant="white" className="mr-2" />
                            Loading Payment...
                        </>
                    ) : (
                        <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            {isLiveMode ? `Pay KSh ${Number(amount).toLocaleString()}` : `Test KSh ${Number(amount).toLocaleString()}`}
                        </>
                    )}
                </Button>

                {!isLiveMode && (
                    <div className="bg-muted/50 rounded-lg p-4 text-xs space-y-1">
                        <p className="font-semibold">Test Card Details:</p>
                        <p>Card: <code>5531886652142950</code></p>
                        <p>CVV: <code>564</code> | Expiry: <code>09/32</code></p>
                        <p>PIN: <code>3310</code> | OTP: <code>123456</code></p>
                    </div>
                )}
            </div>
        </Card>
    )
}
