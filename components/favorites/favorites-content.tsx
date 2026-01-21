"use client"

import { Heart, Trash2, Calendar, MapPin, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFavorites } from "@/lib/favorites-context"
import { getAllListings } from "@/lib/listings-data"

export function FavoritesContent() {
  const { favorites, removeFavorite } = useFavorites()
  const allListings = getAllListings()
  const favoriteListings = allListings.filter((listing) => favorites.includes(listing.id))

  return (
    <div className="gradient-mesh min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            {favoriteListings.length} {favoriteListings.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>

        {favoriteListings.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring and save items you love by clicking the heart icon
            </p>
            <Link href="/categories">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Browse Listings</Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteListings.map((listing) => (
              <Card key={listing.id} className="glass-card overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={listing.images[0] || "/placeholder.svg"}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-500"
                    onClick={() => removeFavorite(listing.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {listing.isFeatured && <Badge className="absolute top-3 left-3 bg-primary">Featured</Badge>}
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {listing.subcategory}
                  </Badge>
                  <h3 className="font-semibold mb-1 line-clamp-1">{listing.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-primary">KSh {listing.pricePerDay.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">/day</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                      {listing.rating}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/listings/${listing.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/listings/${listing.id}?book=true`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white" size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Book
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
