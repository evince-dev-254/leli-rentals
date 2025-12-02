"use client"

import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
    variant?: "card" | "list" | "grid"
    count?: number
    className?: string
}

export function LoadingState({ variant = "card", count = 3, className }: LoadingStateProps) {
    if (variant === "card") {
        return (
            <div className={cn("space-y-4", className)}>
                {Array.from({ length: count }).map((_, i) => (
                    <GlassCard key={i} className="p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        )
    }

    if (variant === "grid") {
        return (
            <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-700 rounded-3xl mb-4" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // list variant
    return (
        <div className={cn("space-y-3", className)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                    <div className="h-16 w-16 rounded-xl bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    )
}
