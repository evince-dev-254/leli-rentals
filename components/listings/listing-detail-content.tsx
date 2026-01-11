"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  Shield,
  Calendar,
  Clock,
  Check,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { LeaveReviewDialog } from "@/components/dashboard/leave-review-dialog"
import { getCategoryById } from "@/lib/categories-data"
import { getCategoryStringId } from "@/lib/category-uuid-map"
import { useFavorites } from "@/lib/favorites-context"
import { useMessages } from "@/lib/messages-context"
const BookingModal = dynamic(() => import("@/components/booking/booking-modal").then(mod => mod.BookingModal), {
  ssr: false,
  loading: () => <div className="p-4 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
})
import type { Listing } from "@/lib/listings-data"
import { cn } from "@/lib/utils"

interface ListingDetailContentProps {
  listing: Listing
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
// Default Nairobi coordinates used in CreateListing
const DEFAULT_NAIROBI_LAT = -1.2921
const DEFAULT_NAIROBI_LNG = 36.8219

export function ListingDetailContent({ listing }: ListingDetailContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDates, setSelectedDates] = useState<Date | undefined>()
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [correctedCoords, setCorrectedCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [showShareToast, setShowShareToast] = useState(false)

  useEffect(() => {
    const checkAndFixCoordinates = async () => {
      // Check if coordinates match default Nairobi AND location string doesn't mention Nairobi
      const lat = listing.latitude ?? 0
      const lng = listing.longitude ?? 0

      const isDefaultCoords =
        Math.abs(lat - DEFAULT_NAIROBI_LAT) < 0.001 &&
        Math.abs(lng - DEFAULT_NAIROBI_LNG) < 0.001

      const isNotNairobiLocation = listing.location && !listing.location.toLowerCase().includes("nairobi")

      if (isDefaultCoords && isNotNairobiLocation && MAPBOX_TOKEN) {
        console.log("Detected default coordinates for non-Nairobi location. Attempting to geocode:", listing.location)
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(listing.location)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=KE`,
          )
          const data = await response.json()
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center
            setCorrectedCoords({ lat, lng })
          }
        } catch (err) {
          console.error("Failed to auto-correct coordinates:", err)
        }
      }
    }

    checkAndFixCoordinates()
  }, [listing.latitude, listing.longitude, listing.location])

  const mapLat = correctedCoords ? correctedCoords.lat : listing.latitude
  const mapLng = correctedCoords ? correctedCoords.lng : listing.longitude
  const mapKey = correctedCoords ? `corrected-${listing.id}` : listing.id


  const { isFavorite, toggleFavorite } = useFavorites()
  const { startConversation } = useMessages()
  const isLiked = isFavorite(listing.id)

  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    // Initial check
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setAuthenticatedUser(user)
      setIsAuthLoading(false)
    }
    getSession()

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticatedUser(session?.user ?? null)
      setIsAuthLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Listing category is often a UUID from DB, translate back to string slug for lookup
  const categorySlug = getCategoryStringId(listing.category) || listing.category
  const category = getCategoryById(categorySlug)

  const nextImage = () => {
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % listing.images.length;
        console.log('Moving to next image:', nextIndex, 'of', listing.images.length);
        return nextIndex;
      });
    }
  }

  const prevImage = () => {
    if (listing.images && listing.images.length > 0) {
      setCurrentImageIndex((prev) => {
        const prevIndex = (prev - 1 + listing.images.length) % listing.images.length;
        console.log('Moving to previous image:', prevIndex, 'of', listing.images.length);
        return prevIndex;
      });
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: listing.title,
      text: listing.description,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShowShareToast(true)
        setTimeout(() => setShowShareToast(false), 3000)
      } catch (err) {
        console.error("Failed to copy link:", err)
      }
    }
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    startConversation(
      listing.ownerId || "owner-1",
      listing.ownerName,
      listing.ownerAvatar || "",
      listing.id,
      listing.title,
      listing.images[0] || "",
      chatMessage,
    )
    setChatMessage("")
    setIsChatOpen(false)
    // Redirect to messages
    window.location.href = "/messages"
  }

  return (
    <div className="gradient-mesh min-h-screen pb-24 sm:pb-8 pt-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb and Top Actions */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <BackButton
            href={`/categories/${categorySlug}`}
            label={`Back to ${category?.name || "Categories"}`}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-sm"
              onClick={() => toggleFavorite(listing.id)}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-red-500 text-red-500")} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-sm"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden glass-card shadow-lg group bg-gradient-to-br from-gray-100 to-gray-200">
              {listing.images && listing.images.length > 0 ? (
                <>
                  <img
                    src={listing.images[currentImageIndex] || '/placeholder.svg'}
                    alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    onError={(e) => {
                      console.warn('Image failed to load:', listing.images[currentImageIndex]);
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                    onLoad={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    style={{ opacity: '0' }}
                    suppressHydrationWarning
                  />
                  {/* Loading state */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center transition-opacity duration-300" style={{ opacity: '0' }}>
                    <span className="text-white text-lg font-semibold">Loading...</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">No Image Available</span>
                </div>
              )}

              {listing.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/60 backdrop-blur-md hover:bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/60 backdrop-blur-md hover:bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/20 backdrop-blur-md rounded-full">
                    {listing.images.map((_, index) => (
                      <button
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-300",
                          index === currentImageIndex ? "bg-white w-5" : "bg-white/50 hover:bg-white/70"
                        )}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {listing.isFeatured && <Badge className="bg-primary/90 backdrop-blur-sm font-semibold">Featured</Badge>}
                {listing.isVerified && (
                  <Badge className="bg-green-500/90 backdrop-blur-sm font-semibold">
                    <Shield className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>

              {/* Counter Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium">
                {currentImageIndex + 1} / {listing.images.length}
              </div>
            </div>

            {/* Title and Info */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-3 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
                    {listing.subcategory}
                  </Badge>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">{listing.title}</h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-y-3 gap-x-6 text-muted-foreground mt-4">
                    <div className="flex items-center text-sm font-semibold bg-secondary/30 w-fit px-3 py-1.5 rounded-full border border-border/50">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      {listing.location}
                    </div>
                    <div className="flex items-center text-sm px-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-2" />
                      <span className="font-extrabold text-foreground text-base">{listing.rating}</span>
                      <span className="ml-2 text-xs opacity-70 font-medium">({listing.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8 opacity-50" />

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="flex w-full overflow-x-auto sm:grid sm:grid-cols-3 mb-6 bg-secondary/30 p-1 h-auto sm:h-10">
                  <TabsTrigger value="description" className="flex-1 py-2 text-sm">Details</TabsTrigger>
                  <TabsTrigger value="amenities" className="flex-1 py-2 text-sm">Features</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1 py-2 text-sm">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                      {listing.description}
                    </p>
                  </div>

                  {(listing.latitude !== undefined && listing.longitude !== undefined || correctedCoords) && (
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Explore Location
                      </h3>
                      <div className="h-72 sm:h-80 rounded-2xl overflow-hidden border shadow-inner relative group">
                        <Map
                          key={mapKey}
                          initialViewState={{
                            latitude: mapLat ?? 0,
                            longitude: mapLng ?? 0,
                            zoom: 14
                          }}
                          mapStyle="mapbox://styles/mapbox/streets-v11"
                          mapboxAccessToken={MAPBOX_TOKEN}
                          style={{ width: '100%', height: '100%' }}
                        >
                          <NavigationControl position="bottom-right" />
                          <Marker longitude={mapLng} latitude={mapLat} color="#9333ea" />
                        </Map>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {listing.location}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="amenities" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {(listing.amenities || []).map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/20 border border-secondary/30 hover:bg-secondary/40 transition-colors">
                        <div className="p-1.5 bg-primary/10 rounded-full">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h3 className="font-bold text-xl mb-1">Guest Reviews</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-foreground font-bold">{listing.rating}</span>
                        <span>&bull; {listing.reviewCount} total reviews</span>
                      </div>
                    </div>
                    {authenticatedUser ? (
                      <LeaveReviewDialog
                        bookingId="placeholder-booking-id"
                        listingId={listing.id}
                        listingTitle={listing.title}
                        listingImage={listing.images[0]}
                      >
                        <Button className="rounded-full px-6">Rate this Rental</Button>
                      </LeaveReviewDialog>
                    ) : (
                      <Button
                        variant="outline"
                        className="rounded-full px-6"
                        onClick={() => window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`}
                      >
                        Login to Review
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-6 rounded-2xl bg-secondary/10 border border-secondary/20">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={`/diverse-group.png?height=48&width=48&query=person ${i}`} />
                            <AvatarFallback className="font-bold">U{i}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold">Happy Renter</p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {[...Array(5)].map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={cn(
                                    "h-3.5 w-3.5",
                                    idx < 5 - i + 3 ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"
                                  )}
                                />
                              ))}
                              <span className="ml-2 text-xs text-muted-foreground font-medium">2 weeks ago</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed italic">
                          &quot;Great experience! The item was exactly as described and the owner was very responsive. The pickup process was seamless.&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Owner Info */}
            <Card className="glass-card border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-secondary/10 pb-4">
                <CardTitle className="text-lg font-bold">Hosted by</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-4 ring-background shadow-md">
                      <AvatarImage src={listing.ownerAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xl font-bold">
                        {listing.ownerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 p-1 bg-green-500 rounded-full border-2 border-background shadow-sm">
                      <Shield className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="font-extrabold text-xl">{listing.ownerName}</p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1.5" />
                          <span className="font-bold text-foreground">{listing.ownerRating}</span>
                          <span className="ml-1">({listing.ownerReviews} reviews)</span>
                        </div>
                        <div className="flex items-center font-medium text-green-600 dark:text-green-400">
                          <Check className="h-4 w-4 mr-1" />
                          Identity Verified
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-1 justify-center sm:justify-start">
                      <Button variant="outline" className="rounded-full px-5" onClick={() => setIsChatOpen(true)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat with Owner
                      </Button>
                      <Link href={`/users/${listing.ownerId}`}>
                        <Button variant="ghost" className="rounded-full px-5">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar - Hidden on mobile, replaced by bottom bar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="glass-card rounded-3xl p-8 sticky top-24 shadow-xl border border-border/40">
              {/* Pricing */}
              <div className="mb-8 text-center sm:text-left">
                <div className="flex items-baseline justify-center sm:justify-start gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-primary">KSh {listing.pricePerDay.toLocaleString()}</span>
                  <span className="text-muted-foreground font-medium">/ day</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="p-4 rounded-2xl bg-secondary/20 border border-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Weekly</p>
                    <p className="font-extrabold text-lg text-foreground">KSh {listing.pricePerWeek.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/20 border border-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Monthly</p>
                    <p className="font-extrabold text-lg text-foreground">KSh {listing.pricePerMonth.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-8 opacity-50" />

              {/* Calendar */}
              <div className="mb-8">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Select Rental Dates
                </h4>
                <div className="rounded-2xl border bg-secondary/5 p-2 calendar-custom">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDates}
                    onSelect={setSelectedDates}
                    className="w-full"
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-center gap-2 mb-8 p-4 rounded-2xl bg-green-500/10 text-green-600 border border-green-500/20">
                <div className="relative">
                  <Clock className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <span className="text-sm font-bold tracking-tight">Ready for Instant Booking</span>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95"
                  onClick={() => {
                    if (!authenticatedUser) {
                      window.location.href = "/login"
                    } else {
                      setIsBookingOpen(true)
                    }
                  }}
                >
                  {authenticatedUser ? "Reserve Now" : "Sign In to Book"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl bg-transparent font-semibold border-2"
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Inquire First
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">Free cancellation for 48 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED BOTTOM ACTION BAR - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50 p-4 pb-safe-offset shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)] safe-bottom-padding">
        <div className="container flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-primary">KSh {listing.pricePerDay.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground font-medium">/ night</span>
            </div>
            <button
              onClick={() => {
                const calendarElement = document.querySelector('[value="description"]')
                calendarElement?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-xs font-bold text-muted-foreground underline text-left"
            >
              {selectedDates ? selectedDates.toLocaleDateString() : "Select dates"}
            </button>
          </div>
          <Button
            className="flex-1 max-w-[200px] h-12 text-base font-bold rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20"
            onClick={() => {
              if (!authenticatedUser) {
                window.location.href = "/login"
              } else {
                setIsBookingOpen(true)
              }
            }}
          >
            {authenticatedUser ? "Reserve" : "Login"}
          </Button>
        </div>
      </div>

      {/* Toast Notification (Simple) */}
      {showShareToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl animate-in fade-in zoom-in duration-300">
          Link copied to clipboard!
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal listing={listing} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      {/* Chat Modal */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Message {listing.ownerName}</DialogTitle>
            <DialogDescription className="text-base">
              Send an inquiry about <span className="font-bold text-foreground">{listing.title}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="flex gap-4 p-4 bg-secondary/20 rounded-2xl border border-secondary/30">
              <div className="w-20 h-16 shrink-0 rounded-xl overflow-hidden shadow-sm relative">
                <img
                  src={listing.images[0] || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                  suppressHydrationWarning
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-bold text-sm line-clamp-1">{listing.title}</p>
                <p className="text-xs text-primary font-bold">KSh {listing.pricePerDay.toLocaleString()}/day</p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold px-1">Your Message</label>
              <Input
                placeholder="Hi, I'm interested in renting this..."
                className="h-14 rounded-xl border-2 focus:ring-primary/20 transition-all"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold px-1">
                Typical response time: 2 hours
              </p>
            </div>
            <Button
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 font-bold text-lg text-white shadow-xl shadow-purple-500/10"
              onClick={handleSendMessage}
              disabled={!chatMessage.trim()}
            >
              <Send className="h-5 w-5 mr-3" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
