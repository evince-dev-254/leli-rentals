"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Check, Crown, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

export default function PricingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                setUserRole(profile?.role || null)
            }
        }
        checkUser()
    }, [])

    const handleSelectPlan = (plan: 'weekly' | 'monthly') => {
        setLoading(true)
        if (userRole === 'owner') {
            router.push('/dashboard/subscription')
        } else {
            router.push('/become-owner')
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                            Simple Pricing
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Transparent Plans for Everyone
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Start small or go big. Choose the plan that fits your rental business needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Weekly Plan */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
                            <div className="relative h-full glass-card rounded-3xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col">
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-blue-500/10 rounded-2xl w-fit">
                                            <Zap className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                            Flexible
                                        </Badge>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Weekly Plan</h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-4xl font-bold">KSh 500</span>
                                        <span className="text-muted-foreground">/ 7 days</span>
                                    </div>
                                    <p className="text-muted-foreground">Perfect for trying out the platform or short-term listing needs.</p>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 p-1 bg-green-500/10 rounded-full">
                                            <Check className="h-3 w-3 text-green-500" />
                                        </div>
                                        <span><strong className="text-foreground">Up to 10</strong> active listings</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 p-1 bg-green-500/10 rounded-full">
                                            <Check className="h-3 w-3 text-green-500" />
                                        </div>
                                        <span>7-day active duration</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 p-1 bg-green-500/10 rounded-full">
                                            <Check className="h-3 w-3 text-green-500" />
                                        </div>
                                        <span>Basic analytics</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 p-1 bg-green-500/10 rounded-full">
                                            <Check className="h-3 w-3 text-green-500" />
                                        </div>
                                        <span>Standard support</span>
                                    </li>
                                </ul>

                                <Button
                                    variant="outline"
                                    className="w-full h-12 text-base font-medium"
                                    onClick={() => handleSelectPlan('weekly')}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Select Weekly'}
                                </Button>
                            </div>
                        </div>

                        {/* Monthly Plan */}
                        <div className="relative group">
                            <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-[25px] opacity-70 blur-sm group-hover:opacity-100 transition-opacity" />
                            <div className="relative h-full bg-card rounded-3xl p-8 flex flex-col">
                                <div className="absolute top-0 right-0 -mt-4 mr-8">
                                    <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 px-4 py-1.5 shadow-lg">
                                        Most Popular
                                    </Badge>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-primary/10 rounded-2xl w-fit">
                                            <Crown className="h-6 w-6 text-primary" />
                                        </div>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                                            Best Value
                                        </Badge>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Monthly Plan</h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-4xl font-bold">KSh 1,000</span>
                                        <span className="text-muted-foreground">/ 30 days</span>
                                    </div>
                                    <p className="text-muted-foreground">For serious renters wanting maximum exposure and unlimited growth.</p>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 p-1 bg-primary/10 rounded-full">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span><strong className="text-primary">Unlimited</strong> active listings</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 p-1 bg-primary/10 rounded-full">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span>30-day active duration</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 p-1 bg-primary/10 rounded-full">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span>Advanced analytics & insights</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 p-1 bg-primary/10 rounded-full">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span>Priority verified status</span>
                                    </li>
                                </ul>

                                <Button
                                    className="w-full h-12 text-base font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
                                    onClick={() => handleSelectPlan('monthly')}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Select Monthly'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-muted-foreground mb-4">Questions about our pricing?</p>
                        <Button variant="link" className="text-primary" onClick={() => router.push('/contact')}>
                            Contact our support team &rarr;
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
