"use client"

import { Search, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { AdvancedSearch } from "./advanced-search"
import { staggerContainer, fadeInUp } from "@/lib/animations"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Optimized Background Image (LCP Optimization) */}
      <Image
        src="/leli-home-hero-corrected.png"
        alt="Leli Rentals Hero"
        fill
        priority
        className="object-cover object-[center_10%] animate-ken-burns"
        sizes="100vw"
        loading="eager"
      />

      {/* Pink/Purple Gradient Overlay (always visible) */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/10" />

      {/* Dark Overlay for readability - slightly lightened */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Additional Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="container relative z-10 px-4 py-12 sm:py-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-balance text-white drop-shadow-lg"
          >
            Find Your Perfect <span className="text-primary">Rental</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto text-pretty px-4"
          >
            The premier peer-to-peer rental marketplace in Kenya. Discover amazing rentals for every occasion — from cars to equipment, homes to fashion.
          </motion.p>

          {/* Advanced Search Engine */}
          <motion.div
            variants={fadeInUp}
          >
            <AdvancedSearch />
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4 mt-8"
          >
            <span className="text-xs sm:text-sm text-white/70 w-full sm:w-auto">Popular:</span>
            {["Cars", "Apartments", "Cameras", "Event Spaces", "Designer Wear"].map((item) => (
              <Link
                key={item}
                href={`/search?q=${item.toLowerCase()}`}
                className="text-xs sm:text-sm text-white/80 hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {item}
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
