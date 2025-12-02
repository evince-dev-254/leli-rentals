"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProgressBarProps {
    value: number
    max?: number
    className?: string
    showLabel?: boolean
    color?: "blue" | "purple" | "green" | "red"
    size?: "sm" | "md" | "lg"
}

const colorClasses = {
    blue: "bg-gradient-to-r from-blue-500 to-blue-600",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600",
    green: "bg-gradient-to-r from-green-500 to-green-600",
    red: "bg-gradient-to-r from-red-500 to-red-600"
}

const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
}

export function ProgressBar({
    value,
    max = 100,
    className,
    showLabel = false,
    color = "blue",
    size = "md"
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
        <div className={cn("w-full", className)}>
            {showLabel && (
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}
            <div className={cn(
                "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
                sizeClasses[size]
            )}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={cn(
                        "h-full rounded-full",
                        colorClasses[color]
                    )}
                />
            </div>
        </div>
    )
}
