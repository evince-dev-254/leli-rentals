"use client"

import { motion } from "framer-motion"
import { staggerContainer, fadeInUp } from "@/lib/animations"
import type { ReactNode } from "react"

interface AnimatedWrapperProps {
    children: ReactNode
}

export function HeroAnimatedWrapper({ children }: AnimatedWrapperProps) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="container relative z-10 px-4 py-12 sm:py-20"
        >
            {children}
        </motion.div>
    )
}

export function HeroHeading({ children }: AnimatedWrapperProps) {
    return (
        <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-balance text-white drop-shadow-lg"
        >
            {children}
        </motion.h1>
    )
}

export function HeroSubheading({ children }: AnimatedWrapperProps) {
    return (
        <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto text-pretty px-4"
        >
            {children}
        </motion.p>
    )
}

export function HeroSearchWrapper({ children }: AnimatedWrapperProps) {
    return (
        <motion.div variants={fadeInUp}>
            {children}
        </motion.div>
    )
}

export function HeroQuickLinks({ children }: AnimatedWrapperProps) {
    return (
        <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4 mt-8"
        >
            {children}
        </motion.div>
    )
}
