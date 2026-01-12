"use client"

import { Search, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { AdvancedSearch } from "./advanced-search"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Image (Ken Burns Effect) */}
      <div
        className="absolute inset-0 bg-cover bg-[center_10%] animate-ken-burns"
        style={{
          backgroundImage: `url('/leli-home-hero-corrected.png')`,
        }}
      />

      {/* Pink/Purple Gradient Overlay (always visible) */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/10" />

      {/* Dark Overlay for readability - slightly lightened */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Additional Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />

      <div className="container relative z-10 px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-balance text-white drop-shadow-lg"
          >
            Find Your Perfect <span className="text-primary">Rental</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto text-pretty px-4"
          >
            The premier peer-to-peer rental marketplace in Kenya. Discover amazing rentals for every occasion — from cars to equipment, homes to fashion.
          </motion.p>

          {/* Advanced Search Engine - Now sized and positioned optimally */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          >
            <AdvancedSearch />
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
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
      </div>
    </section>
  )
}
