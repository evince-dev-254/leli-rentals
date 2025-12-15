"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import Link from "next/link"

export function HeroSection() {


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Image (Ken Burns Effect) */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
        style={{
          backgroundImage: `url('/leli-hero-bg.jpg')`,
        }}
      />

      {/* Fallback Background Image with Gradient */}


      {/* Pink/Purple Gradient Overlay (always visible) */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-blue-500/20" />

      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Additional Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

      <div className="container relative z-10 px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-white/90">Trusted by 10,000+ users across Kenya</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-balance text-white">
            Find Your Perfect <span className="text-primary">Rental</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto text-pretty px-4">
            Discover amazing rentals for every occasion. From cars to equipment, homes to fashion — we&apos;ve got you
            covered.
          </p>



          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
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
          </div>
        </div>


      </div>
    </section>
  )
}
