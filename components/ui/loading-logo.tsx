"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LoadingLogoProps {
    className?: string
    size?: number
}

export function LoadingLogo({ className, size = 60 }: LoadingLogoProps) {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Pulse Rings */}
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75" />
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse delay-75" />

            {/* Logo Container */}
            <div className="relative bg-background/80 backdrop-blur-sm rounded-full p-4 shadow-xl ring-1 ring-border/50 border border-primary/10">
                <Image
                    src="/logo.png"
                    alt="Loading..."
                    width={size}
                    height={size} // Keep aspect ratio if known, or if unknown, this is just a placeholder with h-auto overriding it.
                    style={{ width: 'auto', height: 'auto' }} // Explicitly tell Next.js we are overriding
                    className="object-contain dark:invert animate-pulse duration-1000"
                    priority
                />
            </div>
        </div>
    )
}
