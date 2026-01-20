import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LeliLoader } from "./leli-loader"

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
        md: "px-6 py-3 gap-3 h-14",
        lg: "px-10 py-5 gap-4 h-20",
        xl: "px-14 py-7 gap-6 h-28"
    }

    const loaderContent = (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Soft Ambient Glow */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={cn(
                    "absolute inset-0 blur-3xl rounded-full",
                    variant === "white" ? "bg-white/10" : "bg-primary/10"
                )}
            />

            {/* Pill-shaped Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={cn(
                    "relative z-10 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500",
                    sizeMap[size],
                    variant === "white"
                        ? "bg-white/10 border border-white/20 backdrop-blur-md"
                        : "bg-white/80 dark:bg-slate-900/80 border border-border backdrop-blur-sm shadow-sm"
                )}
            >
                <LeliLoader
                    size={size === "xl" ? "lg" : size === "lg" ? "md" : "sm"}
                    variant={variant === "white" ? "white" : "default"}
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
