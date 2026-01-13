"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Star, Heart, MapPin, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { FavoriteButton } from "@/components/listings/favorite-button"
import { supabase } from "@/lib/supabase"
import { staggerContainer, fadeInUp, hoverScale } from "@/lib/animations"

export function FeaturedListings() {
  const [featuredListings, setFeaturedListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select(`
            *,
            category:categories(name)
          `)
          .eq('is_featured', true)
          .eq('status', 'approved')
          .limit(6)

        if (error) {
          console.error('Error fetching featured listings:', error)
          return
        }

        if (data) {
          setFeaturedListings(data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  if (loading) {
    return (
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20" />
        <div className="absolute inset-0 bg-secondary/50" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-primary/20 animate-pulse rounded-full" />
              <div className="h-10 w-64 bg-muted animate-pulse rounded-xl" />
              <div className="h-4 w-80 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden h-full">
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted animate-pulse rounded-lg w-3/4" />
                  <div className="h-4 bg-muted animate-pulse rounded-md w-1/2" />
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="h-8 bg-muted animate-pulse rounded-lg w-1/3" />
                    <div className="h-8 bg-muted animate-pulse rounded-lg w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Fallback if no featured listings
  if (featuredListings.length === 0) {
    return null
  }

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
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredListings.map((listing) => (
            <motion.div
              key={listing.id}
              variants={fadeInUp}
              whileHover="hover"
              whileTap="tap"
            >
              <Link href={`/listings/${listing.id}`} className="group h-full block">
                <motion.div
                  variants={hoverScale}
                  className="glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-500 h-full border border-white/10"
                >
                  {/* Image with gradient fallback */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
                    {listing.images && listing.images[0] ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">No Image</span>
                      </div>
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-background/80 text-foreground backdrop-blur-sm">
                        {listing.category?.name || 'Item'}
                      </Badge>
                      {listing.is_verified && (
                        <Badge className="bg-green-500/90 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 z-10" onClick={(e) => e.preventDefault()}>
                      <FavoriteButton listingId={listing.id} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-xl font-bold text-primary">
                        {listing.currency || 'KES'} {listing.price_per_day?.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">/ day</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {listing.title}
                    </h3>

                    {/* Location & Rating */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground line-clamp-1 max-w-[60%]">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate">{listing.location || 'Nairobi'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{listing.rating_average || "New"}</span>
                        {listing.rating_count > 0 && (
                          <span className="text-muted-foreground">({listing.rating_count})</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
