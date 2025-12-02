"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Header } from '@/components/header'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const plans = [
    {
        name: "Weekly Plan",
        price: "Ksh 500",
        duration: "7 days",
        listingLimit: "Up to 10 listings",
        commitment: "Low, flexible",
        features: [
            "List up to 10 items",
            "7-day active listings",
            "Basic analytics",
            "Email support",
            "Standard visibility"
        ],
        recommended: false
    },
    {
        name: "Monthly Plan",
        price: "Ksh 1,000",
        duration: "30 days",
        listingLimit: "Unlimited listings",
        commitment: "High value, stable",
        features: [
            "Unlimited listings",
            "30-day active listings",
            "Advanced analytics",
            "Priority support",
            "Enhanced visibility",
            "Featured badge",
            "Export to Sheets"
        ],
        recommended: true
    }
]

export default function SubscriptionPage() {
    const router = useRouter()
    const { user, isLoaded } = useUser()
    const [isChecking, setIsChecking] = useState(true)
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

    useEffect(() => {
        if (isLoaded) {
            const accountType = (user?.publicMetadata?.accountType as string) ||
                (user?.unsafeMetadata?.accountType as string)

            if (!user) {
                router.push('/sign-in')
                return
            }

            if (accountType !== 'owner') {
                router.push('/')
                return
            }

            setIsChecking(false)
        }
    }, [user, isLoaded, router])

    const handleSelectPlan = async (planName: string, price: string) => {
        setSelectedPlan(planName)

        // TODO: Integrate with Paystack payment
        // For now, redirect to owner dashboard
        setTimeout(() => {
            router.push('/dashboard/owner?subscribed=true')
        }, 1500)
    }

    if (isChecking || !isLoaded) {
        return (
            <>
                <Header />
                <LoadingSpinner
                    message="Loading subscription plans..."
                    variant="default"
                    fullScreen={true}
                    showHeader={false}
                />
            </>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950">
            <Header />

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Badge className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Choose Your Listing Plan
                    </Badge>
                    <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Select Your Subscription
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that best fits your listing needs
                    </p>
                </motion.div>

                {/* Subscription Plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`h-full ${plan.recommended ? 'ring-2 ring-purple-500 shadow-xl' : ''} relative`}>
                                {plan.recommended && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                                            Recommended
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="text-center pb-8 pt-8">
                                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                                            {plan.price}
                                        </span>
                                    </div>
                                    <CardDescription className="space-y-1">
                                        <div><strong>Duration:</strong> {plan.duration}</div>
                                        <div><strong>Listing Limit:</strong> {plan.listingLimit}</div>
                                        <div><strong>Commitment:</strong> {plan.commitment}</div>
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={() => handleSelectPlan(plan.name, plan.price)}
                                        disabled={selectedPlan === plan.name}
                                        className={`w-full h-12 font-semibold text-lg ${plan.recommended
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                                : 'bg-gray-800 hover:bg-gray-900'
                                            } text-white rounded-xl shadow-lg transition-all`}
                                    >
                                        {selectedPlan === plan.name ? 'Processing...' : 'Select Plan'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <Card className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="pt-6">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Note:</strong> All subscriptions auto-renew. You can cancel anytime from your dashboard.
                                Payment is processed securely through Paystack.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    )
}
