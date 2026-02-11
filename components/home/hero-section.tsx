import { Search, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AdvancedSearch } from "./advanced-search"
import {
  HeroAnimatedWrapper,
  HeroHeading,
  HeroSubheading,
  HeroSearchWrapper,
  HeroQuickLinks
} from "./hero-animated-wrapper"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Optimized Background Image (LCP Optimization) */}
      <Image
        src="/leli-home-hero-corrected.png"
        alt="Leli Rentals - Your Perfect Rental Marketplace"
        fill
        priority
        fetchPriority="high"
        className="object-cover object-[center_10%] animate-ken-burns"
        sizes="100vw"
        loading="eager"
      />

      {/* Pink/Purple Gradient Overlay (always visible) */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/10" />

      {/* Dark Overlay for readability - slightly lightened */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Additional Gradient for depth - hidden on small mobile to save GPU */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 hidden sm:block" />

      <HeroAnimatedWrapper>
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <HeroHeading>
            Find Your Perfect <span className="text-primary">Rental</span>
          </HeroHeading>

          {/* Subheading */}
          <HeroSubheading>
            The premier peer-to-peer rental marketplace. Discover amazing rentals for every occasion — from cars to equipment, homes to fashion.
          </HeroSubheading>

          {/* Advanced Search Engine */}
          <HeroSearchWrapper>
            <AdvancedSearch />
          </HeroSearchWrapper>

          {/* Quick Links */}
          <HeroQuickLinks>
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
          </HeroQuickLinks>
        </div>
      </HeroAnimatedWrapper>
    </section>
  )
}
