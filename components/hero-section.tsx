"use client"

import { VideoBackground } from "@/components/video-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, ArrowRight, Car, Home, Wrench, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function HeroSection() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/listings?search=${encodeURIComponent(searchQuery.trim())}&category=${activeTab === 'all' ? '' : activeTab}`)
        } else {
            router.push('/listings')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
            <VideoBackground
                src="/videos/rental-hero-video.mp4"
                fallbackImage="/luxury-house-hero.jpg"
                className="h-full w-full"
                overlayStyle="bg-gradient-to-r from-pink-500/90 via-purple-500/90 to-indigo-500/90 mix-blend-multiply"
            >
                <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl space-y-4"
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent pb-2">
                            Find Your Perfect Rental
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200 sm:text-xl md:text-2xl font-medium">
                            Discover amazing rentals for every occasion.
                        </p>
                        <p className="mx-auto mt-2 max-w-2xl text-base text-gray-300 sm:text-lg">
                            From cars to equipment, we've got you covered.
                        </p>
                    </motion.div>
                </div>
            </VideoBackground>
        </section>
    )
}
