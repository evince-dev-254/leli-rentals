"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, MapPin, Star, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Listing } from "@/lib/listings-service"
import { ListingCard } from "@/components/listing-card"

const featuredListings = [
    {
        id: "1",
        title: "Modern Downtown Loft",
        location: "Nairobi, CBD",
        price: "KSh 15,000",
        period: "/ night",
        rating: 4.9,
        reviews: 128,
        image: "/modern-apartment-city-view.png",
        category: "Homes",
    },
    {
        id: "2",
        title: "Range Rover Sport 2024",
        location: "Westlands, Nairobi",
        price: "KSh 25,000",
        period: "/ day",
        rating: 5.0,
        reviews: 45,
        image: "/luxury-cars-in-modern-showroom.jpg",
        category: "Vehicles",
    },
    {
        id: "3",
        title: "Sony A7IV Cinema Kit",
        location: "Kilimani, Nairobi",
        price: "KSh 5,000",
        period: "/ day",
        rating: 4.8,
        reviews: 89,
        image: "/professional-construction-and-industrial-equipment.jpg",
        category: "Equipment",
    },
    {
        id: "4",
        title: "Garden Event Space",
        location: "Karen, Nairobi",
        price: "KSh 40,000",
        period: "/ day",
        rating: 4.7,
        reviews: 210,
        image: "/elegant-event-venue-with-chandeliers-and-tables.jpg",
        category: "Events",
    },
    {
        id: "5",
        title: "DJI Mavic 3 Pro",
        location: "Lavington, Nairobi",
        price: "KSh 8,000",
        period: "/ day",
        rating: 4.9,
        reviews: 67,
        image: "/modern-electronics-and-tech-gadgets-display.jpg",
        category: "Electronics",
    },
]

export function FeaturedListingsScroll() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollXProgress } = useScroll({ container: containerRef })

    // Transform simple mock data to full Listing objects
    const listings: Listing[] = featuredListings.map(item => ({
        id: item.id,
        title: item.title,
        description: "",
        fullDescription: "",
        price: parseInt(item.price.replace(/[^0-9]/g, '')),
        price_type: item.period.replace('/ ', ''),
        location: item.location,
        rating: item.rating,
        reviews: item.reviews,
        image: item.image,
        images: [item.image],
        amenities: [],
        available: true,
        category: item.category.toLowerCase(),
        owner: {
            id: "owner1",
            name: "Premium Host",
            avatar: "/placeholder.svg",
            rating: 4.9,
            verified: true
        }
    }))

    return (
        <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                            <Star className="h-4 w-4 fill-current" />
                            Top Rated
                        </div>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Featured Listings
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                            Hand-picked selection of the highest rated rentals available now.
                        </p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => containerRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}>
                            <ArrowRight className="h-4 w-4 rotate-180" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => containerRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Scroll Container */}
                <div
                    ref={containerRef}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {listings.map((listing) => (
                        <div key={listing.id} className="min-w-[300px] md:min-w-[350px] snap-center">
                            <ListingCard listing={listing} />
                        </div>
                    ))}

                    {/* View All Card */}
                    <div className="min-w-[200px] flex items-center justify-center snap-center">
                        <Link href="/listings" className="group flex flex-col items-center gap-4 text-gray-500 hover:text-blue-600 transition-colors">
                            <div className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center group-hover:border-blue-600 transition-colors">
                                <ArrowRight className="h-6 w-6" />
                            </div>
                            <span className="font-medium">View All Listings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
