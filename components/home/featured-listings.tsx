"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, MapPin, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { FavoriteButton } from "@/components/listings/favorite-button"
import { supabase } from "@/lib/supabase"

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
      <section className="relative py-20 px-4 overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20" />
        <div className="absolute inset-0 bg-secondary/50" />
        <div className="relative z-10 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading featured listings...</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <Link key={listing.id} href={`/listings/${listing.id}`} className="group">
              <div className="glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                {/* Image with gradient fallback */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
                  {listing.images && listing.images[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
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
                  <div className="absolute top-3 right-3 z-10">
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
