"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Home, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fadeInUp } from "@/lib/animations"

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [countdown, setCountdown] = useState(10)

    const reference = searchParams.get("reference")
    const bookingId = searchParams.get("booking_id")

    useEffect(() => {
        // Countdown redirect to dashboard
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    router.push("/dashboard")
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    return (
        <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                className="glass-card rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center border border-white/10"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle className="h-12 w-12 text-green-500" />
                </motion.div>

                {/* Success Message */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Your payment has been processed successfully. You will receive a confirmation email shortly.
                </p>

                {/* Payment Details */}
                {reference && (
                    <div className="glass-card rounded-xl p-4 mb-8 border border-white/10">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Transaction Reference:</span>
                            <span className="font-mono font-semibold">{reference}</span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    <Button asChild size="lg" className="rounded-full">
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Go to Dashboard
                        </Link>
                    </Button>

                    {bookingId && (
                        <Button asChild variant="outline" size="lg" className="rounded-full">
                            <Link href={`/dashboard/bookings/${bookingId}`}>
                                <Receipt className="mr-2 h-4 w-4" />
                                View Booking
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Auto Redirect Notice */}
                <p className="text-xs text-muted-foreground">
                    Redirecting to dashboard in {countdown} seconds...
                </p>
            </motion.div>
        </div>
    )
}
