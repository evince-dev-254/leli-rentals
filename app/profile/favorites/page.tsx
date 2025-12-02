"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlassCard } from "@/components/glass-card"
import { StatCard } from "@/components/stat-card"
import { GradientText } from "@/components/gradient-text"
import { motion } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Heart, Search, Filter, Calendar, DollarSign, Star, MapPin,
  Eye, Trash2, Share2, MessageCircle, Clock, CheckCircle,
  TrendingUp, Users, Award, ShoppingCart
} from "lucide-react"
import { useUser } from '@clerk/nextjs'
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { favoritesService, Favorite } from "@/lib/favorites-service"
import { favoritesDB } from "@/lib/interactions-database-service"
import { supabase } from "@/lib/supabase"
import { Listing } from "@/lib/listings-service"
import { ListingCard } from "@/components/listing-card"

const categories = [
  { value: "all", label: "All Categories" },
  { value: "vehicles", label: "Vehicles" },
  { value: "homes", label: "Homes & Apartments" },
  { value: "equipment", label: "Equipment" },
  { value: "sports", label: "Sports & Recreation" },
  { value: "tech", label: "Electronics" },
]

export default function FavoritesPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<{ id: string, listingId: string, title: string } | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
    }
  }, [isLoaded, user, router])

  // Load user favorites from both database and localStorage
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const allFavorites: Favorite[] = []

        // 1. Load favorites from Supabase database
        try {
          const dbFavorites = await favoritesDB.getUserFavorites(user.id)

          // Enrich database favorites with listing details
          const enrichedDbFavorites = await Promise.all(
            dbFavorites.map(async (fav) => {
              try {
                const { data: listing } = await supabase
                  .from('listings')
                  .select('id, title, description, price, category, images, location, contact_info, status')
                  .eq('id', fav.listing_id)
                  .single()

                if (listing && listing.status === 'published') {
                  const dbImages = Array.isArray(listing.images) && listing.images.length > 0
                    ? listing.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '')
                    : null

                  return {
                    id: fav.id || `db_${fav.listing_id}`,
                    userId: user.id,
                    listingId: fav.listing_id,
                    title: listing.title || 'Untitled',
                    description: listing.description || '',
                    price: listing.price || 0,
                    category: listing.category || 'misc',
                    image: dbImages?.[0] || '/placeholder.svg',
                    location: listing.location || '',
                    ownerName: listing.contact_info?.name || 'Unknown',
                    rating: 4.5,
                    reviews: 0,
                    addedDate: fav.created_at ? new Date(fav.created_at) : new Date(),
                    isAvailable: true,
                  } as Favorite
                }
                return null
              } catch (error) {
                console.error('Error enriching favorite:', error)
                return null
              }
            })
          )

          allFavorites.push(...enrichedDbFavorites.filter(f => f !== null) as Favorite[])
        } catch (error) {
          console.error('Error loading database favorites:', error)
        }

        // 2. Load liked items from localStorage
        if (typeof window !== 'undefined') {
          try {
            const likedItems = JSON.parse(localStorage.getItem('likedItems') || '[]') as string[]

            // Fetch listing details for liked items
            const likedFavorites = await Promise.all(
              likedItems.map(async (listingId) => {
                try {
                  const { data: listing } = await supabase
                    .from('listings')
                    .select('id, title, description, price, category, images, location, contact_info, status')
                    .eq('id', listingId)
                    .single()

                  if (listing && listing.status === 'published') {
                    const dbImages = Array.isArray(listing.images) && listing.images.length > 0
                      ? listing.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '')
                      : null

                    return {
                      id: `local_${listingId}`,
                      userId: user.id,
                      listingId: listing.id,
                      title: listing.title || 'Untitled',
                      description: listing.description || '',
                      price: listing.price || 0,
                      category: listing.category || 'misc',
                      image: dbImages?.[0] || '/placeholder.svg',
                      location: listing.location || '',
                      ownerName: listing.contact_info?.name || 'Unknown',
                      rating: 4.5,
                      reviews: 0,
                      addedDate: new Date(), // Use current date as we don't know when it was liked
                      isAvailable: true,
                    } as Favorite
                  }
                  return null
                } catch (error) {
                  console.error('Error fetching liked listing:', error)
                  return null
                }
              })
            )

            // Filter out duplicates (items that are already in database favorites)
            const existingListingIds = new Set(allFavorites.map(f => f.listingId))
            const uniqueLikedFavorites = likedFavorites.filter(
              f => f !== null && !existingListingIds.has(f!.listingId)
            ) as Favorite[]

            allFavorites.push(...uniqueLikedFavorites)
          } catch (error) {
            console.error('Error loading localStorage favorites:', error)
          }
        }

        // Sort by added date (newest first)
        allFavorites.sort((a, b) =>
          new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
        )

        setFavorites(allFavorites)
      } catch (error) {
        console.error("Error loading favorites:", error)
        setFavorites([])
      } finally {
        setIsLoading(false)
      }
    }
    loadFavorites()
  }, [user])

  const filteredFavorites = favorites.filter(favorite => {
    const matchesSearch = favorite.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      favorite.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || favorite.category === categoryFilter
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const handleRemoveFavorite = async (favoriteId: string, listingId: string) => {
    if (!user) return

    try {
      // Remove from database favorites (try both ways - by ID and by listing ID)
      // If it has a real database ID or starts with 'db_', try to remove from DB
      if (favoriteId && (!favoriteId.startsWith('local_'))) {
        await favoritesDB.removeFavorite(user.id, listingId)
      }

      // Remove from localStorage if it exists there
      if (typeof window !== 'undefined') {
        try {
          const likedItems = JSON.parse(localStorage.getItem('likedItems') || '[]') as string[]
          const updatedItems = likedItems.filter(id => id !== listingId)
          localStorage.setItem('likedItems', JSON.stringify(updatedItems))
        } catch (error) {
          console.error('Error updating localStorage:', error)
        }
      }

      // Update local state
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))

      toast({
        title: "Removed from favorites",
        description: "This item has been removed from your favorites.",
      })
    } catch (error) {
      console.error("Error removing favorite:", error)
      toast({
        title: "Error removing favorite",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBookNow = async (listingId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Redirecting to booking",
        description: "Taking you to the booking page...",
      })

      // In a real app, this would redirect to the booking page
      router.push(`/items/${listingId}`)
    } catch (error) {
      toast({
        title: "Error accessing listing",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShareListing = async (listingId: string) => {
    try {
      if (typeof window !== 'undefined' && navigator.share) {
        await navigator.share({
          title: "Check out this rental on Leli Rentals",
          url: `${window.location.origin}/items/${listingId}`,
        })
      } else if (typeof window !== 'undefined' && navigator.clipboard) {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/items/${listingId}`)
        toast({
          title: "Link copied!",
          description: "The listing link has been copied to your clipboard.",
        })
      }
    } catch (error) {
      toast({
        title: "Error sharing listing",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vehicles":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "homes":
        return "bg-green-100 text-green-800 border-green-200"
      case "equipment":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "sports":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "tech":
        return "bg-pink-100 text-pink-800 border-pink-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find(cat => cat.value === category)
    return categoryObj?.label || category
  }

  // Show loading state while checking authentication
  if (!isLoaded) {
    return <LoadingSpinner message="Loading..." variant="profile" />
  }

  // Show loading while redirecting
  if (!user) {
    return <LoadingSpinner message="Redirecting..." variant="profile" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                <GradientText from="from-blue-600" to="to-purple-600">My Favorites</GradientText>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                Items you've saved for later rental
              </p>
            </div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Back to Profile
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Favorites"
            value={favorites.length.toString()}
            icon={<Heart className="h-5 w-5" />}
            color="red"
          />

          <StatCard
            title="Available"
            value={favorites.filter(f => f.isAvailable).length.toString()}
            icon={<CheckCircle className="h-5 w-5" />}
            color="green"
          />

          <StatCard
            title="Avg. Price"
            value={`KSh ${favorites.length > 0 ? Math.round(favorites.reduce((sum, f) => sum + (f.price || 0), 0) / favorites.length).toLocaleString('en-KE') : '0'}`}
            icon={<TrendingUp className="h-5 w-5" />}
            color="blue"
          />

          <StatCard
            title="Avg. Rating"
            value={(favorites.length > 0 ? (Math.round(favorites.reduce((sum, f) => sum + (f.rating || 0), 0) / favorites.length * 10) / 10) : 0).toString()}
            icon={<Award className="h-5 w-5" />}
            color="purple"
          />
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 sm:h-auto"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-1 px-3 py-2 h-10 sm:h-auto border border-gray-300 rounded-md text-sm"
                  aria-label="Filter by category"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 h-10 sm:h-auto border border-gray-300 rounded-md text-sm"
                  aria-label="Sort by"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <Button variant="outline" className="w-full sm:w-auto h-10 sm:h-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map((favorite) => {
            // Map Favorite to Listing
            const listing: Listing = {
              id: favorite.listingId,
              title: favorite.title,
              description: favorite.description,
              fullDescription: favorite.description,
              price: favorite.price,
              location: favorite.location,
              rating: favorite.rating,
              reviews: favorite.reviews,
              image: favorite.image,
              images: [favorite.image],
              amenities: [],
              available: favorite.isAvailable,
              category: favorite.category,
              owner: {
                id: "unknown",
                name: favorite.ownerName,
                avatar: "/placeholder.svg",
                rating: 4.5,
                verified: true
              }
            }

            return (
              <div key={favorite.id} className="relative group">
                <ListingCard
                  listing={listing}
                  isSaved={true}
                  onSave={() => {
                    // Trigger remove dialog
                    // We need to find the trigger button or manage state
                    // Since ListingCard onSave is a direct action, we'll wrap it
                    // But here we want to show the dialog. 
                    // Let's use a state for 'itemToRemove' and open dialog manually
                    setItemToRemove({ id: favorite.id || '', listingId: favorite.listingId, title: favorite.title })
                  }}
                  onBook={() => handleBookNow(favorite.listingId)}
                  onViewDetails={(id) => router.push(`/listings/details/${id}`)}
                  onShare={(id, title) => handleShareListing(id)}
                />
              </div>
            )
          })}
        </div>

        {filteredFavorites.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No favorites found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || categoryFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start exploring and save items you'd like to rent later."
                }
              </p>
              {!searchQuery && categoryFilter === "all" && (
                <Button
                  onClick={() => router.push('/listings')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Browse Listings
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}




