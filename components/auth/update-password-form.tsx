"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Message } from "@/components/ui/message"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"

export function UpdatePasswordForm() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        setError("")

        try {
            const { error } = await supabase.auth.updateUser({ password })
            if (error) {
                // Handle specific error messages
                if (error.message.includes('should be different')) {
                    setError("New password must be different from your current password")
                } else if (error.message.includes('Password should contain')) {
                    setError("Password must contain: uppercase, lowercase, number, and special character")
                } else {
                    setError(error.message)
                }
                setLoading(false)
                return
            }

            setSuccess(true)
            setTimeout(() => router.push("/login"), 2000)
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="w-full max-w-md">
                <div className="glass-card rounded-2xl p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Password Updated</h1>
                    <p className="text-muted-foreground mb-6">
                        Your password has been changed successfully. Redirecting to sign in...
                    </p>
                    <Button onClick={() => router.push("/login")} className="w-full">
                        Sign In Now
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md">
            <div className="glass-card rounded-2xl p-8">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <Image src="/logo.png" alt="leli rentals" width={150} height={40} className="h-10 dark:invert" style={{ width: 'auto' }} />
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
                    <p className="text-muted-foreground">Enter your new password below</p>
                </div>

                {error && <Message type="error" message={error} className="mb-6" />}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground" disabled={loading}>
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
