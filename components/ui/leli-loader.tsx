"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LeliLoaderProps {
    className?: string
    size?: "sm" | "md" | "lg"
    variant?: "default" | "white"
}

export function LeliLoader({
    className,
    size = "md",
    variant = "default"
}: LeliLoaderProps) {
    const sizeClasses = {
        sm: "h-1.5 w-1.5 gap-1",
        md: "h-2 w-2 gap-1.5",
        lg: "h-3 w-3 gap-2"
    }

    const dotVariants = {
        animate: (i: number) => ({
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
            }
        })
    }

    const colors = variant === "white"
        ? ["bg-white", "bg-white/80", "bg-white/60"]
        : ["bg-orange-500", "bg-emerald-500", "bg-purple-500"]

    return (
        <div className={cn("flex items-center justify-center", sizeClasses[size], className)} style={{ gap: size === "sm" ? 3 : size === "md" ? 6 : 8 }}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    custom={i}
                    variants={dotVariants}
                    animate="animate"
                    className={cn(
                        "rounded-full",
                        variant === "white" ? colors[i] : colors[i],
                        size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2.5 w-2.5" : "h-4 w-4"
                    )}
                />
            ))}
        </div>
    )
}
