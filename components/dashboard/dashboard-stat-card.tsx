"use client"

import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardStatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: string
    trendUp?: boolean // true for green, false for red
    color?: "blue" | "green" | "orange" | "purple" | "red" | "teal" | "indigo" | "rose" | "amber" | "warm-blend" | "sunset" | "amber-glow" | "rose-highlight"
    className?: string
}

const colorStyles = {
    blue: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-500/20",
    green: "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-emerald-500/20",
    orange: "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-orange-500/20",
    purple: "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white shadow-purple-500/20",
    red: "bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-red-500/20",
    teal: "bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white shadow-teal-500/20",
    indigo: "bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white shadow-indigo-500/20",
    rose: "bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 text-white shadow-rose-500/20",
    amber: "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-amber-500/20",
    // New Warm Blends
    "warm-blend": "bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white shadow-orange-500/20",
    "sunset": "bg-gradient-to-br from-pink-500 via-rose-500 to-yellow-500 text-white shadow-pink-500/20",
    "amber-glow": "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-amber-500/20",
    "rose-highlight": "bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 text-white shadow-rose-500/20",
}

export function DashboardStatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = "blue",
    className,
}: DashboardStatCardProps) {
    return (
        <Card className={cn("overflow-hidden border-none shadow-lg transition-all hover:scale-[1.02]", colorStyles[color], className)}>
            <CardContent className="p-6 relative">
                <div className="flex justify-between items-start z-10 relative">
                    <div>
                        <p className="text-white/80 font-medium text-sm mb-1">{title}</p>
                        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
                        {description && (
                            <p className="text-white/60 text-xs mt-2 font-medium">{description}</p>
                        )}
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                </div>

                {/* Decorative background shape */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full pointer-events-none" />
            </CardContent>
        </Card>
    )
}
