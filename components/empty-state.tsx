"use client"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
    icon: React.ReactNode
    title: string
    description: string
    action?: React.ReactNode
    className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6 text-gray-400 dark:text-gray-600">
                {icon}
            </div>
            <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                {description}
            </p>
            {action && <div>{action}</div>}
        </div>
    )
}
