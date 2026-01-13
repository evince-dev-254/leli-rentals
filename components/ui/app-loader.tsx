"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AppLoaderProps {
    className?: string
    size?: "sm" | "md" | "lg" | "xl"
    variant?: "default" | "white" | "primary"
    fullscreen?: boolean
}

export function AppLoader({
    className,
    size = "md",
    variant = "default",
    fullscreen = false
}: AppLoaderProps) {
    const sizeMap = {
        sm: "px-4 py-2 gap-2 h-10",
        md: "px-8 py-4 gap-3 h-16",
        lg: "px-12 py-6 gap-4 h-24",
        xl: "px-16 py-8 gap-6 h-32"
    }

    const loaderContent = (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Soft Ambient Glow */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={cn(
                    "absolute inset-0 blur-3xl rounded-full",
                    variant === "white" ? "bg-white/20" : "bg-primary/20"
                )}
            />

            {/* Pill-shaped Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={cn(
                    "relative z-10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border flex items-center justify-center overflow-hidden transition-all duration-500",
                    sizeMap[size],
                    variant === "white"
                        ? "bg-white/10 border-white/20 backdrop-blur-md"
                        : "bg-white dark:bg-slate-900 border-border"
                )}
            >
                {/* Logo with specific Hand & Key Animation */}
                <motion.div
                    animate={{
                        y: [0, -4, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative flex items-center justify-center h-full w-full"
                >
                    <img
                        src="/logo.png"
                        alt="Leli Rentals"
                        className={cn(
                            "h-full w-auto object-contain",
                            variant === "white" ? "brightness-0 invert" : "dark:invert"
                        )}
                    />
                </motion.div>

                {/* Subtle scanning light effect */}
                <motion.div
                    animate={{
                        x: ['-100%', '200%'],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full skew-x-12"
                />
            </motion.div>
        </div>
    )

    if (fullscreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fef2f2] dark:bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-500">
                {loaderContent}
            </div>
        )
    }

    return loaderContent
}
