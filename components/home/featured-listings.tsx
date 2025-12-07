"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, MapPin, ArrowRight, CheckCircle2 } from "lucide-react"

const featuredListings = [
  {
    id: 1,
    title: "Modern Downtown Loft",
    category: "homes",
    location: "Nairobi, CBD",
    price: 15000,
    period: "night",
    rating: 4.9,
    reviews: 128,
    image: "/garden-wedding-venue-outdoor.jpg",
    verified: true,
  },
  {
    id: 2,
    title: "Range Rover Sport 2024",
    category: "vehicles",
    location: "Westlands, Nairobi",
    price: 25000,
    period: "day",
    rating: 4.8,
    reviews: 89,
    image: "/mercedes-s-class-black-luxury.jpg",
    verified: true,
  },
  {
    id: 3,
    title: "Sony A7IV Cinema Kit",
    category: "equipment",
    location: "Kilimani, Nairobi",
    price: 5000,
    period: "day",
    rating: 5.0,
    reviews: 64,
    image: "/sony-a7iv-camera-mirrorless.jpg",
    verified: true,
  },
  {
    id: 4,
    title: "Garden Event Space",
    category: "events",
    location: "Karen, Nairobi",
    price: 40000,
    period: "day",
    rating: 4.9,
    reviews: 156,
    image: "/garden-wedding-venue-outdoor.jpg",
    verified: true,
  },
  {
    id: 5,
    title: "DJI Mavic 3 Pro",
    category: "electronics",
    location: "Lavington, Nairobi",
    price: 8000,
    period: "day",
    rating: 4.7,
    reviews: 42,
    image: "/modern-tech-gadgets-laptop-headphones-smart-device.jpg",
    verified: true,
  },
  {
    id: 6,
    title: "Luxury Designer Gown",
    category: "fashion",
    location: "Westlands, Nairobi",
    price: 3500,
    period: "day",
    rating: 4.8,
    reviews: 73,
    image: "/designer-evening-gown-collection.jpg",
    verified: true,
  },
]

export function FeaturedListings() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Gradient Background - matching hero section */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20" />
      <div className="absolute inset-0 bg-secondary/50" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">Top Rated</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Featured Listings</h2>
            <p className="text-muted-foreground mt-2">
              Hand-picked selection of the highest rated rentals available now.
            </p>
          </div>
          <Link href="/listings">
            <Button variant="outline" className="glass-card bg-transparent">
              View All Listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <Link key={listing.id} href={`/listings/${listing.id}`} className="group">
              <div className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Image with gradient fallback */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
                  <img
                    src={listing.image || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Hide broken image, show gradient background
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-background/80 text-foreground backdrop-blur-sm">{listing.category}</Badge>
                    {listing.verified && (
                      <Badge className="bg-green-500/90 text-white">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  {/* Favorite Button */}
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-xl font-bold text-primary">KSh {listing.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ {listing.period}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {listing.title}
                  </h3>

                  {/* Location & Rating */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{listing.rating}</span>
                      <span className="text-muted-foreground">({listing.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
