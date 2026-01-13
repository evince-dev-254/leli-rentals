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
        sm: "h-6 w-6 p-1",
        md: "h-12 w-12 p-2",
        lg: "h-20 w-20 p-4",
        xl: "h-32 w-32 p-6"
    }

    const loaderContent = (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Pulsing Background Rings */}
            <motion.div
                initial={{ opacity: 0.2, scale: 0.8 }}
                animate={{
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={cn(
                    "absolute inset-0 rounded-full",
                    variant === "white" ? "bg-white/20" : "bg-primary/20"
                )}
            />

            <motion.div
                initial={{ opacity: 0.1, scale: 0.5 }}
                animate={{
                    opacity: [0.05, 0.2, 0.05],
                    scale: [1.2, 1.8, 1.2],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                }}
                className={cn(
                    "absolute inset-0 rounded-full",
                    variant === "white" ? "bg-white/10" : "bg-primary/10"
                )}
            />

            {/* Rotating & Pulsing Logo Container */}
            <motion.div
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className={cn(
                    "relative z-10 rounded-2xl shadow-lg border backdrop-blur-md flex items-center justify-center overflow-hidden",
                    sizeMap[size],
                    variant === "white"
                        ? "bg-white/10 border-white/20 shadow-white/5"
                        : "bg-background/80 border-primary/20 shadow-primary/10"
                )}
            >
                <motion.img
                    src="/icon.svg"
                    alt="Leli Rentals"
                    className={cn(
                        "w-full h-full object-contain",
                        variant === "white" ? "brightness-0 invert" : ""
                    )}
                    animate={{
                        scale: [1, 1.1, 1],
                        filter: [
                            "drop-shadow(0 0 0px rgba(var(--primary), 0))",
                            "drop-shadow(0 0 10px rgba(var(--primary), 0.5))",
                            "drop-shadow(0 0 0px rgba(var(--primary), 0))"
                        ]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>
        </div>
    )

    if (fullscreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-md animate-in fade-in duration-500">
                {loaderContent}
            </div>
        )
    }

    return loaderContent
}
