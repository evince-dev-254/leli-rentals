"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Users, Building2, TrendingUp, Loader2 } from "lucide-react"
import Image from "next/image"

const accountTypes = [
    {
        value: "renter",
        label: "Renter",
        description: "Browse and rent items from verified owners",
        icon: Users,
        features: ["Browse all categories", "Book items instantly", "Rate and review", "Save favorites"]
    },
    {
        value: "owner",
        label: "Owner",
        description: "List your items and earn money",
        icon: Building2,
        features: ["List unlimited items", "Set your own prices", "Manage bookings", "Subscription required"]
    },
    {
        value: "affiliate",
        label: "Affiliate",
        description: "Earn commissions by referring users",
        icon: TrendingUp,
        features: ["Unique referral link", "Track earnings", "Monthly payouts", "Marketing materials"]
    }
]

export default function SelectRolePage() {
    const [selectedRole, setSelectedRole] = useState("renter")
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/signin')
                return
            }
            setUser(user)

            // Check if user already has a profile with a role
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile && profile.role && profile.role !== 'renter') {
                // User already selected a role, redirect them
                const redirectUrl = getRoleRedirect(profile.role)
                router.push(redirectUrl)
            }
        }

        checkUser()
    }, [router])

    const handleContinue = async () => {
        if (!user) return

        setLoading(true)

        try {
            // Upsert user profile with selected role (covers case where profile row doesn't exist)
            const res = await supabase
                .from('user_profiles')
                .upsert({ id: user.id, role: selectedRole, email: user.email }, { onConflict: 'id' })
                .select()
                .single()

            // Supabase client returns an object with 'data' and 'error'
            // Log the full response to help debug the original empty-object error
            // (previously you only destructured 'error' which can sometimes be an empty object in dev stack traces)
            // eslint-disable-next-line no-console
            console.debug('Role update response:', res)

            if (res.error) {
                // Include the message and details if present
                const errObj = {
                    message: res.error.message,
                    details: (res.error as any).details ?? null,
                    hint: (res.error as any).hint ?? null,
                }
                console.error('Error updating role:', errObj)
                alert('Failed to update account type. ' + (res.error.message || 'Please try again.'))
                return
            }

            // Redirect based on role
            const redirectUrl = getRoleRedirect(selectedRole)
            router.push(redirectUrl)
        } catch (err) {
            // Catch unexpected exceptions (network, runtime)
            // eslint-disable-next-line no-console
            console.error('Exception while updating role:', err)
            alert('Failed to update account type due to a network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-4xl">
                    <Card className="glass-card">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Image src="/logo.png" alt="Leli Rentals" width={150} height={40} className="h-10 w-auto dark:invert" />
                            </div>
                            <CardTitle className="text-2xl">Choose Your Account Type</CardTitle>
                            <CardDescription>
                                Select how you want to use Leli Rentals. You can change this later in settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                                <div className="grid gap-4">
                                    {accountTypes.map((type) => {
                                        const Icon = type.icon
                                        return (
                                            <label
                                                key={type.value}
                                                className={`cursor-pointer transition-all ${selectedRole === type.value ? 'ring-2 ring-primary' : ''
                                                    }`}
                                            >
                                                <Card className={selectedRole === type.value ? 'border-primary' : ''}>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start gap-4">
                                                            <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <Icon className="h-6 w-6 text-primary" />
                                                                    <div>
                                                                        <Label htmlFor={type.value} className="text-lg font-semibold cursor-pointer">
                                                                            {type.label}
                                                                        </Label>
                                                                        <p className="text-sm text-muted-foreground">{type.description}</p>
                                                                    </div>
                                                                </div>
                                                                <ul className="mt-3 space-y-1">
                                                                    {type.features.map((feature, index) => (
                                                                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                                                            <span className="text-primary">✓</span>
                                                                            {feature}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </label>
                                        )
                                    })}
                                </div>
                            </RadioGroup>

                            <Button
                                onClick={handleContinue}
                                disabled={loading}
                                className="w-full h-12"
                                size="lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Setting up your account...
                                    </>
                                ) : (
                                    'Continue'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
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
