"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { XCircle, ArrowLeft, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fadeInUp } from "@/lib/animations"

export default function PaymentFailedPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const message = searchParams.get("message") || "Your payment could not be processed"
    const bookingId = searchParams.get("booking_id")

    return (
        <div className="min-h-screen gradient-mesh flex items-center justify-center p-4">
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                className="glass-card rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center border border-white/10"
            >
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <XCircle className="h-12 w-12 text-red-500" />
                </motion.div>

                {/* Error Message */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Payment Failed</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {message}. Please try again or contact support if the problem persists.
                </p>

                {/* Common Reasons */}
                <div className="glass-card rounded-xl p-6 mb-8 text-left border border-white/10">
                    <h3 className="font-semibold mb-3">Common reasons for payment failure:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Insufficient funds in your account</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Incorrect card details or expired card</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Transaction declined by your bank</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>Network or connectivity issues</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {bookingId ? (
                        <Button asChild size="lg" className="rounded-full">
                            <Link href={`/listings/${bookingId}`}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Try Again
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild size="lg" className="rounded-full">
                            <Link href="/search">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Search
                            </Link>
                        </Button>
                    )}

                    <Button asChild variant="outline" size="lg" className="rounded-full">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                </div>

                {/* Support Link */}
                <p className="text-sm text-muted-foreground mt-8">
                    Need help?{" "}
                    <Link href="/contact" className="text-primary hover:underline">
                        Contact Support
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}
