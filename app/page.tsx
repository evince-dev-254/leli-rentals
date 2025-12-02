"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { BentoGridCategories } from "@/components/bento-grid-categories"
import { FeaturedListingsScroll } from "@/components/featured-listings-scroll"
import { FestiveBanner } from "@/components/festive-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, User, Search, Shield, Star, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { useUser } from '@clerk/nextjs'
import { useRouter } from "next/navigation"
import { createWelcomeNotification } from "@/lib/welcome-notification"

export default function HomePage() {
  return <HomePageContent />
}

function HomePageContent() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  // Check if user needs to select account type and redirect
  useEffect(() => {
    if (user && isLoaded) {
      const accountType = (user.publicMetadata?.accountType as string) ||
        (user.unsafeMetadata?.accountType as string)

      // If account type is not set or is 'not_selected', redirect to get-started
      if (!accountType || accountType === 'not_selected') {
        router.push('/get-started')
        return
      }

      // Check if this is a new sign-in (hasn't seen welcome notification)
      const hasSeenWelcome = localStorage.getItem(`welcome_${user.id}`)

      if (!hasSeenWelcome) {
        const userName = user.fullName || user.firstName || 'User'

        // Create welcome notification
        createWelcomeNotification(user.id, userName, accountType as 'renter' | 'owner')

        // Mark as seen
        localStorage.setItem(`welcome_${user.id}`, 'true')
      }
    }
  }, [user, isLoaded, router])

  const shouldShowGetStarted = !user

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main>
        <HeroSection />



        <BentoGridCategories />

        <FeaturedListingsScroll />

        {/* Value Proposition */}
        <section className="py-24 relative overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/40 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20">
                <div className="w-12 h-12 bg-blue-100/60 dark:bg-blue-900/40 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-gray-900 dark:text-white">Verified & Secure</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every listing is verified by our team. Payments are held securely until your rental is successfully completed.
                </p>
              </div>
              <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20">
                <div className="w-12 h-12 bg-purple-100/60 dark:bg-purple-900/40 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-gray-900 dark:text-white">Instant Booking</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  No more waiting for approvals. Look for the instant book icon to secure your rental immediately.
                </p>
              </div>
              <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20">
                <div className="w-12 h-12 bg-pink-100/60 dark:bg-pink-900/40 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-3 text-gray-900 dark:text-white">Premium Experience</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  From luxury cars to high-end cameras, access premium items without the cost of ownership.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Started CTA */}
        {shouldShowGetStarted && (
          <section className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] bg-blue-200/20 dark:bg-blue-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-200/20 dark:bg-purple-400/10 rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
              <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl p-12 rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-2xl">
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                  Ready to start your journey?
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-200 mb-10 max-w-2xl mx-auto">
                  Join thousands of users renting and earning on Leli Rentals today.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/get-started">
                    <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                      Get Started Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/categories">
                    <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white hover:bg-white/70 dark:hover:bg-gray-800/70 font-bold text-lg backdrop-blur-sm">
                      Browse Listings
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <FestiveBanner />
      <Footer />
    </div>
  )
}


