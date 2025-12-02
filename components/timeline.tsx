"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TimelineItem {
    id: string
    title: string
    description: string
    timestamp: string | Date
    icon?: React.ReactNode
    color?: "blue" | "purple" | "green" | "red" | "orange"
}

interface TimelineProps {
    items: TimelineItem[]
    className?: string
}

const colorClasses = {
    blue: {
        dot: "bg-blue-500",
        line: "bg-blue-200 dark:bg-blue-900",
        icon: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    purple: {
        dot: "bg-purple-500",
        line: "bg-purple-200 dark:bg-purple-900",
        icon: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    },
    green: {
        dot: "bg-green-500",
        line: "bg-green-200 dark:bg-green-900",
        icon: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
    },
    red: {
        dot: "bg-red-500",
        line: "bg-red-200 dark:bg-red-900",
        icon: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
    },
    orange: {
        dot: "bg-orange-500",
        line: "bg-orange-200 dark:bg-orange-900",
        icon: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
    }
}

export function Timeline({ items, className }: TimelineProps) {
    return (
        <div className={cn("space-y-6", className)}>
            {items.map((item, index) => {
                const color = item.color || "blue"
                const isLast = index === items.length - 1

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex gap-4"
                    >
                        {/* Timeline line and dot */}
                        <div className="flex flex-col items-center">
                            {item.icon ? (
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    colorClasses[color].icon
                                )}>
                                    {item.icon}
                                </div>
                            ) : (
                                <div className={cn(
                                    "w-3 h-3 rounded-full",
                                    colorClasses[color].dot
                                )} />
                            )}
                            {!isLast && (
                                <div className={cn(
                                    "w-0.5 flex-1 mt-2",
                                    colorClasses[color].line
                                )} />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {item.title}
                                </h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {typeof item.timestamp === 'string'
                                        ? item.timestamp
                                        : item.timestamp.toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
