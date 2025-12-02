"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GlassCardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
    gradient?: boolean
    onClick?: () => void
}

export function GlassCard({ children, className, hover = false, gradient = false, onClick }: GlassCardProps) {
    const Component = hover ? motion.div : "div"

    return (
        <Component
            onClick={onClick}
            {...(hover ? {
                whileHover: { y: -4, scale: 1.01 },
                transition: { duration: 0.2 }
            } : {})}
            className={cn(
                "relative rounded-3xl overflow-hidden",
                "bg-white/80 dark:bg-gray-900/80",
                "backdrop-blur-xl",
                "border border-gray-200/50 dark:border-gray-700/50",
                "shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50",
                hover && "hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-gray-800/50 transition-shadow duration-300",
                className
            )}
        >
            {gradient && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
            )}
            <div className="relative z-10">
                {children}
            </div>
        </Component>
    )
}
