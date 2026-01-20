"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Users, Building2, TrendingUp, Check } from "lucide-react"
import Image from "next/image"
import { AppLoader } from "@/components/ui/app-loader"
import { BackButton } from "@/components/ui/back-button"
import { toast } from "sonner"
import { requestStaffAccess } from "@/lib/actions/staff-actions"

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
        label: "I want to Rent Out",
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
    const [currentRole, setCurrentRole] = useState<string | null>(null)
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

            // Fetch profile to identify current role
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile && profile.role) {
                setCurrentRole(profile.role)
                setSelectedRole(profile.role === 'staff_pending' ? 'staff' : profile.role)

                if (!force && profile.role !== 'staff_pending') {
                    // Already has a role and not forced, redirect
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
            // Check if user is requesting staff role
            if (selectedRole === 'staff' && currentRole !== 'staff') {
                const result = await requestStaffAccess(user.id)
                if (result.success) {
                    toast.success("Staff access request sent! An admin will review it soon.")
                    setCurrentRole('staff_pending')
                    setLoading(false)
                    return
                } else {
                    throw new Error(result.error)
                }
            }

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
                const updates: any = { role: selectedRole }

                // If becomes owner for the first time or switching back to owner, 
                // we should check if owner_at needs to be set.
                // For simplicity, if role is owner, we set owner_at if it's missing.
                if (selectedRole === 'owner' && !existingProfile.owner_at) {
                    updates.owner_at = new Date().toISOString()
                }

                // If switching away from owner and was suspended, potentially un-suspend
                // assuming the suspension was just for verification.
                if (selectedRole !== 'owner' && existingProfile.account_status === 'suspended') {
                    updates.account_status = 'active'
                }

                const { error: updateError } = await supabase
                    .from('user_profiles')
                    .update(updates)
                    .eq('id', user.id)
                error = updateError

                // If switching to affiliate, ensure affiliate record exists
                if (!error && selectedRole === 'affiliate') {
                    const { data: existingAffiliate } = await supabase
                        .from('affiliates')
                        .select('id')
                        .eq('user_id', user.id)
                        .single()

                    if (!existingAffiliate) {
                        // Generate a simple unique invite code logic (timestamp + random)
                        const uniqueSuffix = Math.random().toString(36).substring(2, 7);
                        const inviteCode = `REF-${Date.now().toString().slice(-4)}${uniqueSuffix}`.toUpperCase();

                        const { error: affiliateError } = await supabase
                            .from('affiliates')
                            .insert({
                                user_id: user.id,
                                email: user.email,
                                invite_code: inviteCode,
                                status: 'active', // Auto-activate for now, or use 'pending' if manual approval needed
                                commission_rate: 10.00
                            })

                        if (affiliateError) {
                            console.error('Error creating affiliate record:', affiliateError)
                            // We don't block the profile update, but we warn
                            toast.warning("Profile updated but affiliate account creation failed. Please contact support.")
                        }
                    }
                }
            }

            if (error) throw error

            toast.success("Account set up successfully!")

            // Artificial delay for UX
            setTimeout(() => {
                router.push(getRoleRedirect(selectedRole))
            }, 800)

        } catch (err: any) {
            // Log full error securely to console for debugging
            console.error('Error updating role:', err)

            // Show generic user-friendly error message
            toast.error("An unexpected error occurred. Please try again or contact support.")

            setLoading(false)
        }
    }

    if (initializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <AppLoader size="lg" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col gradient-mesh relative overflow-hidden">
            {/* Background elements are now handled by gradient-mesh or can be removed if redundant */}

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
                            Choose your primary account type to get started. Don&apos;t worry, you can verify your identity to list items later.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                        {accountTypes.map((type) => {
                            const Icon = type.icon
                            const isSelected = selectedRole === type.value
                            const isCurrent = currentRole === type.value

                            return (
                                <div
                                    key={type.value}
                                    onClick={() => setSelectedRole(type.value)}
                                    className={`
                                        cursor-pointer group relative rounded-xl transition-all duration-300 overflow-hidden
                                        ${isSelected
                                            ? `ring-2 ${type.ring} ring-offset-2 ring-offset-background shadow-lg scale-[1.02]`
                                            : "hover:scale-[1.01] hover:shadow-md border border-border/40 bg-card/40"
                                        }
                                    `}
                                >
                                    {isCurrent && (
                                        <div className="absolute top-0 right-0 z-20">
                                            <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-sm">
                                                <div className="h-1 w-1 rounded-full bg-white animate-pulse" />
                                                Active Now
                                            </div>
                                        </div>
                                    )}

                                    {type.value === 'staff' && currentRole === 'staff_pending' && (
                                        <div className="absolute top-0 right-0 z-20">
                                            <div className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-1 shadow-sm">
                                                <div className="h-1 w-1 rounded-full bg-white animate-pulse" />
                                                Pending Review
                                            </div>
                                        </div>
                                    )}

                                    <div className="h-full p-5 flex flex-col items-center text-center relative">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ${type.color} ${isSelected ? 'scale-110 rotate-3' : 'group-hover:scale-105'}`}>
                                            <Icon className="h-7 w-7" />
                                        </div>

                                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{type.label}</h3>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                                            {type.description}
                                        </p>

                                        <div className="space-y-2 w-full text-left mt-auto">
                                            {type.features.slice(0, 3).map((feature, i) => (
                                                <div key={i} className="flex items-center text-xs text-foreground/70">
                                                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0">
                                                        <Check className="h-2.5 w-2.5 text-primary" />
                                                    </div>
                                                    <span className="truncate">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={`mt-5 w-5 h-5 rounded-full border flex items-center justify-center transition-all
                                            ${isSelected ? `border-primary bg-primary text-white scale-110 shadow-sm shadow-primary/30` : "border-muted-foreground/20 bg-background/50"}
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
                                    <AppLoader size="sm" variant="white" className="mr-3" />
                                    Setting up your profile...
                                </>
                            ) : (
                                selectedRole === 'staff' && currentRole !== 'staff' && currentRole !== 'staff_pending'
                                    ? 'Request Staff Access'
                                    : selectedRole === 'staff' && currentRole === 'staff_pending'
                                        ? 'Request Pending Review'
                                        : 'Continue to Dashboard'
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
            return '/dashboard/renter'
        case 'owner':
            return '/dashboard/owner'
        case 'affiliate':
            return '/dashboard/affiliate'
        case 'admin':
            return '/dashboard/admin'
        case 'staff':
            return '/staff'
        default:
            return '/categories'
    }
}
