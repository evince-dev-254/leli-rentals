"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns"
import { Tag, Copy, ArrowRight, Loader2, Sparkles, Clock, Percent, DollarSign, Gift, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/glass-card"
import { GradientText } from "@/components/gradient-text"
import { useToast } from "@/hooks/use-toast"
import { couponService } from "@/lib/coupon-service"

// Countdown Timer Component
function CountdownTimer({ expiryDate }: { expiryDate: string }) {
    const [timeLeft, setTimeLeft] = useState("")

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date()
            const expiry = new Date(expiryDate)
            const days = differenceInDays(expiry, now)
            const hours = differenceInHours(expiry, now) % 24
            const minutes = differenceInMinutes(expiry, now) % 60

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`)
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`)
            } else if (minutes > 0) {
                setTimeLeft(`${minutes}m`)
            } else {
                setTimeLeft("Expired")
            }
        }

        updateTimer()
        const interval = setInterval(updateTimer, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [expiryDate])

    return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>{timeLeft}</span>
        </div>
    )
}

export default function DealsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [deals, setDeals] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const data = await couponService.getActiveDeals()
                setDeals(data || [])
            } catch (error) {
                console.error("Error fetching deals:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDeals()
    }, [])

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast({
            title: "Code Copied!",
            description: `${code} has been copied to your clipboard.`
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading amazing deals...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
            <Header />

            {/* Hero Section */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                            <Sparkles className="h-4 w-4" />
                            Limited Time Offers
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Exclusive{" "}
                            <GradientText from="from-blue-600" to="to-purple-600">
                                Deals & Offers
                            </GradientText>
                        </h1>

                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                            Save on your next rental with these limited-time offers. Copy a code and apply it at checkout!
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {deals.length} Active Deals
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Gift className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Save Up to 50%
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Deals Grid */}
            <div className="container mx-auto px-4 pb-16">
                {deals.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <GlassCard className="text-center py-16 px-6">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Tag className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                No active deals right now
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Check back later for new offers! In the meantime, browse our amazing listings.
                            </p>
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                onClick={() => router.push('/listings')}
                            >
                                Browse Listings
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </GlassCard>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deals.map((deal, index) => (
                            <motion.div
                                key={deal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                            >
                                <GlassCard hover className="h-full flex flex-col relative overflow-hidden">
                                    {/* Discount Badge - Top Right */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                                            {deal.discount_type === 'percentage' ? (
                                                <>
                                                    <Percent className="h-4 w-4" />
                                                    {deal.discount_value}% OFF
                                                </>
                                            ) : (
                                                <>
                                                    <DollarSign className="h-4 w-4" />
                                                    KSh {deal.discount_value} OFF
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                                {deal.code}
                                            </Badge>
                                            {deal.expiry_date && (
                                                <CountdownTimer expiryDate={deal.expiry_date} />
                                            )}
                                        </div>
                                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                            {deal.description || "Special Discount"}
                                        </CardTitle>
                                        {deal.expiry_date && (
                                            <CardDescription className="text-sm">
                                                Valid until {format(new Date(deal.expiry_date), 'MMM d, yyyy')}
                                            </CardDescription>
                                        )}
                                    </CardHeader>

                                    <CardContent className="flex-1 pb-4">
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            {deal.min_booking_amount > 0 && (
                                                <div className="flex items-start gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                                                    <p>Minimum booking: KSh {deal.min_booking_amount.toLocaleString()}</p>
                                                </div>
                                            )}
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                                                <p>Valid for select listings</p>
                                            </div>
                                            {deal.owner && (
                                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <span className="text-xs text-gray-400">Offered by</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">{deal.owner.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="bg-gray-50/50 dark:bg-gray-800/50 p-4 flex gap-3 border-t border-gray-200 dark:border-gray-700">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => copyCode(deal.code)}
                                        >
                                            <Copy className="h-4 w-4 mr-2" />
                                            Copy Code
                                        </Button>
                                        <Button
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                            onClick={() => router.push('/listings')}
                                        >
                                            Book Now
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
