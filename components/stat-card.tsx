"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    trend?: {
        value: number
        label: string
    }
    color?: "blue" | "purple" | "green" | "red" | "orange" | "pink"
    className?: string
}

const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
}

export function StatCard({ title, value, icon, trend, color = "blue", className }: StatCardProps) {
    const getTrendIcon = () => {
        if (!trend) return null
        if (trend.value > 0) return <TrendingUp className="h-4 w-4" />
        if (trend.value < 0) return <TrendingDown className="h-4 w-4" />
        return <Minus className="h-4 w-4" />
    }

    const getTrendColor = () => {
        if (!trend) return ""
        if (trend.value > 0) return "text-green-600 dark:text-green-400"
        if (trend.value < 0) return "text-red-600 dark:text-red-400"
        return "text-gray-600 dark:text-gray-400"
    }

    return (
        <GlassCard hover className={className}>
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-3 rounded-2xl", colorClasses[color])}>
                        {icon}
                    </div>
                    {trend && (
                        <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor())}>
                            {getTrendIcon()}
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                    {trend && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">{trend.label}</p>
                    )}
                </div>
            </div>
        </GlassCard>
    )
}
