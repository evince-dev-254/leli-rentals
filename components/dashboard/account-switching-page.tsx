"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Users, Crown, TrendingUp, ShoppingCart, Shield, ArrowRight, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export function AccountSwitchingPage() {
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [switching, setSwitching] = useState(false)

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setProfile(data)
            }
            setLoading(false)
        }
        loadProfile()
    }, [])

    const handleSwitchRole = async (newRole: string) => {
        if (!profile) return

        setSwitching(true)
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ role: newRole })
                .eq('id', profile.id)

            if (error) throw error

            toast.success(`Successfully switched to ${newRole} account!`)

            // Refresh the page to update dashboard
            setTimeout(() => {
                window.location.href = '/dashboard'
            }, 1000)
        } catch (err) {
            console.error(err)
            toast.error("Failed to switch account")
            setSwitching(false)
        }
    }

    const roleFeatures = {
        renter: {
            icon: ShoppingCart,
            title: "Renter Account",
            description: "Browse and rent items from verified owners",
            color: "teal",
            features: [
                "Access to all rental listings",
                "Easy booking and payments",
                "Order tracking and history",
                "Leave reviews and ratings",
                "Secure messaging with owners"
            ]
        },
        owner: {
            icon: Crown,
            title: "Owner Account",
            description: "List your items and earn money",
            color: "blue",
            features: [
                "Create unlimited listings",
                "Manage bookings and earnings",
                "Analytics dashboard",
                "Verification for trust",
                "Premium subscription options"
            ]
        },
        affiliate: {
            icon: TrendingUp,
            title: "Affiliate Account",
            description: "Earn commissions by referring users",
            color: "pink",
            features: [
                "Unique referral code",
                "Track earnings and referrals",
                "Commission on bookings",
                "Marketing materials",
                "Monthly payouts"
            ]
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const currentRole = profile?.role || 'renter'

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">Switch Account Type</h1>
                <p className="text-muted-foreground mt-2">
                    Choose the account type that best fits your needs. You can switch at any time.
                </p>
            </div>

            {/* Current Account */}
            <Card className="glass-card border-primary/50">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={profile?.avatar_url} />
                            <AvatarFallback>{profile?.full_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle>{profile?.full_name}</CardTitle>
                            <CardDescription>{profile?.email}</CardDescription>
                        </div>
                        <Badge className="bg-primary text-primary-foreground">
                            Current: {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <Separator className="my-8" />

            {/* Account Types Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(roleFeatures).map(([role, details]) => {
                    const Icon = details.icon
                    const isCurrentRole = role === currentRole
                    const colorMap: Record<string, string> = {
                        teal: 'from-teal-500 to-cyan-500',
                        blue: 'from-blue-500 to-indigo-500',
                        pink: 'from-pink-500 to-purple-500'
                    }

                    return (
                        <Card
                            key={role}
                            className={`glass-card transition-all duration-300 ${isCurrentRole
                                    ? 'border-primary/50 shadow-lg shadow-primary/20 scale-105'
                                    : 'hover:border-primary/30 hover:shadow-md'
                                }`}
                        >
                            <CardHeader>
                                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${colorMap[details.color]} flex items-center justify-center mb-4`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="flex items-center justify-between">
                                    {details.title}
                                    {isCurrentRole && (
                                        <Badge variant="outline" className="border-green-500/50 text-green-600 bg-green-50/50">
                                            <Check className="h-3 w-3 mr-1" />
                                            Active
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription>{details.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2">
                                    {details.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {!isCurrentRole && (
                                    <Button
                                        onClick={() => handleSwitchRole(role)}
                                        disabled={switching}
                                        className="w-full mt-4"
                                        variant="outline"
                                    >
                                        Switch to {details.title.split(' ')[0]}
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Information Card */}
            <Card className="bg-secondary/20 border-none">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Important Information</h3>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Switching accounts will redirect you to the appropriate dashboard</li>
                                <li>• All your data and listings will be preserved</li>
                                <li>• You can switch between account types at any time</li>
                                <li>• Some features may require verification or subscription</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
