"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface IconButtonProps {
    icon: LucideIcon
    onClick?: () => void
    variant?: "primary" | "secondary" | "ghost"
    size?: "sm" | "md" | "lg"
    className?: string
    disabled?: boolean
    tooltip?: string
}

const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
}

const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
}

const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg",
    secondary: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
}

export function IconButton({
    icon: Icon,
    onClick,
    variant = "secondary",
    size = "md",
    className,
    disabled = false,
    tooltip
}: IconButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={onClick}
            disabled={disabled}
            title={tooltip}
            className={cn(
                "rounded-full flex items-center justify-center transition-all duration-200",
                sizeClasses[size],
                variantClasses[variant],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <Icon className={iconSizes[size]} />
        </motion.button>
    )
}
