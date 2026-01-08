"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function OAuthConsentPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Get OAuth parameters from URL
    const provider = searchParams.get("provider") || "google"
    const role = searchParams.get("role") || "renter"
    const ref = searchParams.get("ref") || ""
    const action = searchParams.get("action") || "signup" // signup or login

    const handleAuthorize = async () => {
        setIsLoading(true)
        setError("")

        try {
            const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider as "google" | "github",
                options: {
                    redirectTo: `${redirectUrl}/auth/callback?role=${role}&ref=${ref}`,
                    queryParams: provider === "google" ? {
                        access_type: 'offline',
                        prompt: 'consent',
                    } : undefined,
                },
            })

            if (error) throw error
        } catch (err: any) {
            setError(err.message || "Failed to authorize. Please try again.")
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        router.push(action === "signup" ? "/signup" : "/login")
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="w-full max-w-md">
                <div className="glass-card rounded-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/logo.png"
                                alt="leli rentals"
                                width={150}
                                height={40}
                                className="h-10 w-auto dark:invert mx-auto"
                                style={{ height: "auto" }}
                            />
                        </Link>

                        <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold mb-2">Authorize Access</h1>
                        <p className="text-muted-foreground">
                            {provider === "google" ? "Google" : "GitHub"} wants to access your leli rentals account
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Permissions */}
                    <div className="space-y-4 mb-8">
                        <h2 className="text-sm font-semibold text-muted-foreground">This will allow leli rentals to:</h2>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Access your basic profile information</p>
                                    <p className="text-xs text-muted-foreground">Name, email address, and profile picture</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Create and manage your account</p>
                                    <p className="text-xs text-muted-foreground">Sign you in securely without a password</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Keep you signed in</p>
                                    <p className="text-xs text-muted-foreground">Remember your session across visits</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Type */}
                    {action === "signup" && (
                        <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                <span className="font-semibold">Account Type:</span>{" "}
                                {role === "renter" ? "Renter" : role === "owner" ? "Owner" : "Affiliate"}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleAuthorize}
                            disabled={isLoading}
                            className="w-full h-12 bg-primary text-primary-foreground"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Authorizing...
                                </>
                            ) : (
                                `Authorize with ${provider === "google" ? "Google" : "GitHub"}`
                            )}
                        </Button>

                        <Button
                            onClick={handleCancel}
                            disabled={isLoading}
                            variant="outline"
                            className="w-full h-12"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}
