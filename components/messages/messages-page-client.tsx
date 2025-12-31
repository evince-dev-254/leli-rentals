"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { MessagesContent } from "@/components/messages/messages-content"
import { LoadingLogo } from "@/components/ui/loading-logo"

export function MessagesPageClient() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (!session) {
                    // Redirect to sign in if not authenticated
                    router.push('/sign-in?next=/messages')
                    return
                }

                setIsAuthenticated(true)
            } catch (error) {
                console.error("Auth check error:", error)
                router.push('/sign-in')
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingLogo size={60} />
            </div>
        )
    }

    if (!isAuthenticated) {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header and Footer removed for full-screen experience */}
            <main className="flex-1 h-[100dvh] overflow-hidden">
                <MessagesContent />
            </main>
        </div>
    )
}
