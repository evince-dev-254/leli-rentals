"use client"

import { useOnlineStatus } from "@/hooks/use-online-status"
import { WifiOff, Wifi } from "lucide-react"
import { useState, useEffect } from "react"

export function OfflineBanner() {
    const isOnline = useOnlineStatus()
    const [showBackOnline, setShowBackOnline] = useState(false)

    useEffect(() => {
        if (!isOnline) {
            setShowBackOnline(false)
        } else if (isOnline && !showBackOnline) {
            setShowBackOnline(true)
            const timer = setTimeout(() => setShowBackOnline(false), 30000)
            return () => clearTimeout(timer)
        }
    }, [isOnline, showBackOnline])

    if (!isOnline) {
        return (
            <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:w-96 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-destructive text-destructive-foreground px-4 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3 backdrop-blur-md">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <WifiOff className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Connection Interrupted</p>
                        <p className="text-xs opacity-90">Please check your internet connection.</p>
                    </div>
                </div>
            </div>
        )
    }

    if (showBackOnline) {
        return (
            <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:w-96 animate-in slide-in-from-bottom-4 animate-out fade-out duration-500 fill-mode-forwards">
                <div className="bg-green-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center gap-3 backdrop-blur-md">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Wifi className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Back Online</p>
                        <p className="text-xs opacity-90">Your connection has been restored.</p>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
