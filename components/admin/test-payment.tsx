"use client"

import { useState } from "react"
import { usePaystackPayment } from "react-paystack"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Loader2, AlertTriangle, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export function TestPayment() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [amount, setAmount] = useState("100")
    const [loading, setLoading] = useState(false)
    const [isLiveMode, setIsLiveMode] = useState(false)

    const config = {
        reference: `${isLiveMode ? 'LIVE' : 'TEST'}-${new Date().getTime()}`,
        email: email,
        amount: Number(amount) * 100, // Amount in smallest currency unit
        phone: phone, // Phone number for currency detection
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        metadata: {
            custom_fields: [
                {
                    display_name: "Payment Mode",
                    variable_name: "payment_mode",
                    value: isLiveMode ? "live" : "test"
                },
                {
                    display_name: "Phone Number",
                    variable_name: "phone_number",
                    value: phone
                }
            ]
        }
    }

    const initializePayment = usePaystackPayment(config)

    const onSuccess = (reference: any) => {
        setLoading(false)
        router.push(`/payment/success?reference=${reference.reference}`)
    }

    const onClose = () => {
        setLoading(false)
    }

    const handlePayment = () => {
        if (!email || !phone || !amount || Number(amount) < 1) {
            alert("Please fill in all fields (email, phone, amount)")
            return
        }
        setLoading(true)
        initializePayment({ onSuccess, onClose })
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-1.5">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+254712345678 (Kenya)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Include country code (e.g., +254 for Kenya, +234 for Nigeria)
                    </p>
                </div>

                <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Currency auto-detected from phone number
                    </p>
                </div>

                <Button
                    onClick={handlePayment}
                    disabled={loading || !email || !phone || !amount}
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
                            {isLiveMode ? `Charge ${amount}` : `Test ${amount}`}
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

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs">
                    <p className="text-blue-600 dark:text-blue-400">
                        <strong>💡 Tip:</strong> Paystack automatically detects your currency based on your phone number country code.
                    </p>
                </div>
            </div>
        </Card>
    )
}
