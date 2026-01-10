"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Users, Building2, TrendingUp, Loader2, Check } from "lucide-react"
import Image from "next/image"
import { BackButton } from "@/components/ui/back-button"
import { toast } from "sonner"

const accountTypes = [
    {
        value: "renter",
        label: "I want to Rent",
        description: "Browse thousands of items for rent. From cameras to cars.",
        icon: Users,
        color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        ring: "ring-blue-500",
        features: ["Instant bookings", "Secure payments", "Verified reviews"]
    },
    {
        value: "owner",
        label: "I want to Host",
        description: "Earn money by renting out your idle equipment and items.",
        icon: Building2,
        color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        ring: "ring-purple-500",
        features: ["Payment protection", "Insurance options", "Manage listings"]
    },
    {
        value: "affiliate",
        label: "Become an Affiliate",
        description: "Promote Leli Rentals and earn lifetime commissions.",
        icon: TrendingUp,
        color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
        ring: "ring-orange-500",
        features: ["High commissions", "Monthly payouts", "Marketing kit"]
    }
]

export default function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState("renter")
    const [loading, setLoading] = useState(false)
    const [initializing, setInitializing] = useState(true)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            // Get search params
            const params = new URLSearchParams(window.location.search)
            const force = params.get('force') === 'true'

            if (!force) {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (profile && profile.role) {
                    // Already has a role, redirect
                    console.log('User already has role:', profile.role)
                    router.replace(getRoleRedirect(profile.role))
                    return
                }
            }
            setInitializing(false)
        }

        checkUser()
    }, [router])

    const handleContinue = async () => {
        if (!user) return

        setLoading(true)

        try {
            // Check if profile exists
            const { data: existingProfile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            let error

            if (!existingProfile) {
                // Create new profile
                const { error: insertError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                        role: selectedRole,
                        full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Unknown User',
                        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
                        last_login_at: new Date().toISOString()
                    })
                error = insertError
            } else {
                // Update existing
                const { error: updateError } = await supabase
                    .from('user_profiles')
                    .update({ role: selectedRole })
                    .eq('id', user.id)
                error = updateError
            }

            if (error) throw error

            toast.success("Account set up successfully!")

            // Artificial delay for UX
            setTimeout(() => {
                router.push(getRoleRedirect(selectedRole))
            }, 800)

        } catch (err: any) {
            console.error('Error updating role:', err)
            toast.error(err.message || 'Failed to update account type')
            setLoading(false)
        }
    }

    if (initializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-40 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 relative z-10">
                <div className="w-full max-w-5xl">
                    <div className="mb-8 flex items-center justify-between">
                        <BackButton href="/dashboard" label="Back to Dashboard" />
                        <Image src="/logo.png" alt="Leli Rentals" width={120} height={32} className="h-8 w-auto dark:invert opacity-50" />
                    </div>

                    <div className="text-center mb-12 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            How will you use <span className="text-primary">Leli Rentals</span>?
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Choose your primary account type to get started. Don't worry, you can verify your identity to list items later.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {accountTypes.map((type) => {
                            const Icon = type.icon
                            const isSelected = selectedRole === type.value

                            return (
                                <div
                                    key={type.value}
                                    onClick={() => setSelectedRole(type.value)}
                                    className={`
                                        cursor-pointer group relative rounded-2xl transition-all duration-300
                                        ${isSelected
                                            ? `ring-4 ${type.ring} ring-offset-4 ring-offset-background scale-105 shadow-xl`
                                            : "hover:scale-102 hover:shadow-lg border border-transparent hover:border-border/50 bg-card/50"
                                        }
                                    `}
                                >
                                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/5 to-transparent pointer-events-none`} />

                                    <div className="h-full p-8 flex flex-col items-center text-center glass-card border-0 bg-transparent">
                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${type.color}`}>
                                            <Icon className="h-10 w-10" />
                                        </div>

                                        <h3 className="text-2xl font-bold mb-3">{type.label}</h3>
                                        <p className="text-muted-foreground mb-6 leading-relaxed">
                                            {type.description}
                                        </p>

                                        <div className="mt-auto space-y-3 w-full text-left">
                                            {type.features.map((feature, i) => (
                                                <div key={i} className="flex items-center text-sm text-foreground/80">
                                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                                                        <Check className="h-3 w-3 text-primary" />
                                                    </div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <div className={`mt-8 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                            ${isSelected ? `border-primary bg-primary text-white` : "border-muted-foreground/30"}
                                        `}>
                                            {isSelected && <Check className="h-3 w-3" />}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="max-w-md mx-auto">
                        <Button
                            onClick={handleContinue}
                            disabled={loading}
                            className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                    Setting up your profile...
                                </>
                            ) : (
                                'Continue to Dashboard'
                            )}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

function getRoleRedirect(role: string): string {
    switch (role) {
        case 'renter':
            return '/categories'
        case 'owner':
            return '/dashboard/owner'
        case 'affiliate':
            return '/dashboard/affiliate'
        case 'admin':
            return '/dashboard/admin'
        default:
            return '/categories'
    }
}
