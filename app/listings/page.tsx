"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { ListingCard } from "@/components/listing-card"
import { SearchBar } from "@/components/search-bar"
import { FilterPanel } from "@/components/filter-panel"
import { PageHeader } from "@/components/page-header"
import { LoadingState } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  Calendar,
  Car,
  Home,
  Wrench,
  Music,
  Shirt,
  Laptop,
  Dumbbell,
  Camera
} from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Listing } from "@/lib/listings-service"
import { mockListings } from "@/lib/mock-listings-data"
import { useUser } from '@clerk/nextjs'
import { useInteractions } from "@/lib/hooks/use-interactions"
import { useToast } from "@/hooks/use-toast"
import { bookingsDB } from "@/lib/interactions-database-service"
import { notificationService } from "@/lib/notification-service"
import { useNotifications } from "@/lib/notification-context"
import GoogleMapsAutocomplete from '@/components/google-maps-autocomplete'
import { supabase } from "@/lib/supabase"
import { NotificationType } from "@/lib/types/notification"
import { AccountTypeRequiredDropdown } from "@/components/account-type-required-dropdown"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isWithinInterval, parseISO } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

// Mock listings are now imported from lib/mock-listings-data.ts

const mockCategories = [
  { id: "all", name: "All Categories", count: mockListings.length },
  { id: "vehicles", name: "Vehicles", count: mockListings.filter(l => l.category === "vehicles").length },
  { id: "homes", name: "Homes & Apartments", count: mockListings.filter(l => l.category === "homes").length },
  { id: "equipment", name: "Equipment & Tools", count: mockListings.filter(l => l.category === "equipment").length },
  { id: "events", name: "Event Spaces & Venues", count: mockListings.filter(l => l.category === "events").length },
  { id: "fashion", name: "Fashion & Lifestyle", count: mockListings.filter(l => l.category === "fashion").length },
  { id: "tech", name: "Tech & Gadgets", count: mockListings.filter(l => l.category === "tech").length },
  { id: "sports", name: "Sports & Recreation", count: mockListings.filter(l => l.category === "sports").length },
]

export default function ListingsPage() {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { interactions, toggleLike, toggleSave, trackView, trackShare } = useInteractions()
  const { addNotification } = useNotifications()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [listings, setListings] = useState<Listing[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 })
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Enhanced filter states
  const [availabilityFilter, setAvailabilityFilter] = useState("any")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [ratingFilter, setRatingFilter] = useState("any")
  const [locationFilter, setLocationFilter] = useState("")

  // Check if user has account type
  const hasAccountType = user && (
    (user.publicMetadata?.accountType as string) ||
    (user.unsafeMetadata?.accountType as string)
  )

  // Fetch listings from Supabase
  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching listings:', error)
        // Fallback to mock data if Supabase fails
        setListings(mockListings)
        setCategories(mockCategories)
        return
      }

      // Fetch active bookings for availability check
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('listing_id, start_date, end_date, status')
        .neq('status', 'cancelled')
        .gte('end_date', new Date().toISOString())

      if (bookingsData) {
        setBookings(bookingsData)
      }

      if (data && data.length > 0) {
        // Transform Supabase data to Listing format
        const transformedListings: Listing[] = data.map((item: any) => {
          // Handle images: use database images if available, only fallback if truly missing
          const dbImages = Array.isArray(item.images) && item.images.length > 0
            ? item.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '')
            : null

          return {
            id: item.id,
            title: item.title,
            description: item.description || '',
            fullDescription: item.description || '',
            price: item.price,
            location: item.location || '',
            rating: 4.5, // Default rating
            reviews: Math.floor(Math.random() * 200) + 10,
            image: dbImages?.[0] || '/placeholder.svg',
            images: dbImages || ['/placeholder.svg'],
            amenities: item.features || [],
            available: true,
            category: item.category,
            owner: {
              id: item.user_id,
              name: item.contact_info?.name || 'Owner',
              rating: 4.8,
              verified: true,
              phone: item.contact_info?.phone || ''
            },
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at || item.created_at)
          }
        })

        setListings(transformedListings)

        // Update categories with actual counts
        const categoryCount: Record<string, number> = {}
        transformedListings.forEach(l => {
          categoryCount[l.category] = (categoryCount[l.category] || 0) + 1
        })

        setCategories([
          { id: "all", name: "All Categories", count: transformedListings.length },
          { id: "vehicles", name: "Vehicles", count: categoryCount['vehicles'] || 0 },
          { id: "homes", name: "Homes & Apartments", count: categoryCount['homes'] || 0 },
          { id: "equipment", name: "Equipment & Tools", count: categoryCount['equipment'] || 0 },
          { id: "events", name: "Event Spaces & Venues", count: categoryCount['events'] || 0 },
          { id: "fashion", name: "Fashion & Lifestyle", count: categoryCount['fashion'] || 0 },
          { id: "tech", name: "Tech & Gadgets", count: categoryCount['tech'] || 0 },
          { id: "sports", name: "Sports & Recreation", count: categoryCount['sports'] || 0 },
        ])
      } else {
        // No data from Supabase, use mock data
        setListings(mockListings)
        setCategories(mockCategories)
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
      // Fallback to mock data
      setListings(mockListings)
      setCategories(mockCategories)
    }
  }

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
    fetchListings()
  }, [])

  useEffect(() => {
    const search = searchParams ? searchParams.get("search") : null
    const category = searchParams ? searchParams.get("category") : null

    if (search) setSearchQuery(search)
    if (category) setSelectedCategory(category)
  }, [searchParams])

  useEffect(() => {
    let filteredListings = [...mockListings]

    // Filter by category
    if (selectedCategory !== "all") {
      filteredListings = filteredListings.filter(listing => listing.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredListings = filteredListings.filter(listing =>
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query)
      )
    }

    // Filter by location
    if (locationFilter) {
      const location = locationFilter.toLowerCase()
      filteredListings = filteredListings.filter(listing =>
        listing.location.toLowerCase().includes(location)
      )
    }

    // Filter by price range
    filteredListings = filteredListings.filter(listing =>
      listing.price >= priceRange.min && listing.price <= priceRange.max
    )

    // Filter by rating
    if (ratingFilter !== "any") {
      const minRating = parseFloat(ratingFilter)
      filteredListings = filteredListings.filter(listing => listing.rating >= minRating)
    }

    // Filter by availability
    if (dateRange?.from && dateRange?.to) {
      filteredListings = filteredListings.filter(listing => {
        // Check if listing has any overlapping bookings
        const hasOverlap = bookings.some(booking => {
          if (booking.listing_id !== listing.id) return false

          const bookingStart = parseISO(booking.start_date)
          const bookingEnd = parseISO(booking.end_date)
          const rangeStart = dateRange.from!
          const rangeEnd = dateRange.to!

          // Check for overlap
          return (
            (rangeStart <= bookingEnd && rangeStart >= bookingStart) ||
            (rangeEnd <= bookingEnd && rangeEnd >= bookingStart) ||
            (rangeStart <= bookingStart && rangeEnd >= bookingEnd)
          )
        })

        return !hasOverlap
      })
    } else if (availabilityFilter !== "any") {
      // Legacy simple filter
      filteredListings = filteredListings.filter(listing => {
        // Mock availability logic - in real app, this would check actual availability
        const isAvailable = Math.random() > 0.3 // 70% chance of being available
        return isAvailable
      })
    }


    // Sort listings
    filteredListings.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          const aDate = a.created_at ? new Date(a.created_at).getTime() : 0
          const bDate = b.created_at ? new Date(b.created_at).getTime() : 0
          return bDate - aDate
        case "oldest":
          const aDateOld = a.created_at ? new Date(a.created_at).getTime() : 0
          const bDateOld = b.created_at ? new Date(b.created_at).getTime() : 0
          return aDateOld - bDateOld
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "popularity":
          return (b.reviews || 0) - (a.reviews || 0)
        default:
          return 0
      }
    })


    setListings(filteredListings)
  }, [selectedCategory, searchQuery, sortBy, priceRange, availabilityFilter, ratingFilter, locationFilter])

  // Show account type reminder if not set - BLOCK ACCESS
  if (isLoaded && user && !hasAccountType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
        <Header />
        <AccountTypeRequiredDropdown blocking={true} />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Account Type Required
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please select an account type above to access listings and other features.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vehicles": return Car
      case "homes": return Home
      case "equipment": return Wrench
      case "events": return Music
      case "fashion": return Shirt
      case "tech": return Laptop
      case "sports": return Dumbbell
      default: return Camera
    }
  }

  // Interaction handlers
  const handleLike = async (listingId: string) => {
    if (!listingId) return

    // Use a demo user ID if not signed in
    const userId = user?.id || 'demo_user'

    // Check the current liked state BEFORE toggling
    const wasLiked = interactions[listingId]?.liked

    try {
      await toggleLike(listingId)
      toast({
        title: wasLiked ? "Unliked" : "Liked!",
        description: wasLiked ? "Removed from liked listings" : "Added to your liked listings"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      })
    }
  }

  const handleSave = async (listingId: string) => {
    if (!listingId || !user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save listings.",
        variant: "destructive",
      })
      return
    }

    // Check the current saved state BEFORE toggling
    const wasSaved = interactions[listingId]?.saved

    try {
      await toggleSave(listingId)
      const listing = listings.find(l => l.id === listingId)

      toast({
        title: wasSaved ? "Unsaved" : "Saved!",
        description: wasSaved ? "Removed from saved listings" : "Added to your saved listings"
      })

      // Create a persistent notification only when saving, not unsaving
      if (!wasSaved && listing) {
        addNotification({
          userId: user.id,
          type: NotificationType.SYSTEM_ANNOUNCEMENT,
          title: 'Item Saved!',
          message: `You saved the listing: "${listing.title}".`,
          link: `/profile/favorites`,
          isRead: false
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update save status",
        variant: "destructive"
      })
    }
  }

  const handleShare = async (listingId: string, title: string) => {
    if (!listingId || !title) return

    // Use a demo user ID if not signed in
    const userId = user?.id || 'demo_user'

    try {
      if (typeof window !== 'undefined' && navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this rental: ${title}`,
          url: window.location.href
        })
        await trackShare(listingId, 'native_share')
      } else if (typeof window !== 'undefined') {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${title} - ${window.location.href}`)
        await trackShare(listingId, 'clipboard')
        toast({
          title: "Link copied!",
          description: "Listing link copied to clipboard"
        })
      }
    } catch (error) {
      console.error('Share error:', error)
      toast({
        title: "Error",
        description: "Failed to share listing",
        variant: "destructive"
      })
    }
  }

  const handleViewDetails = async (listingId: string) => {
    if (!listingId) return

    // Track view
    await trackView(listingId, { source: 'listing_card' })

    // Navigate to details page
    router.push(`/listings/details/${listingId}`)
  }


  const handleBookNow = async (listing: Listing) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make bookings.",
        variant: "destructive",
      })
      return
    }

    if (!listing.id) {
      toast({
        title: "Error",
        description: "Invalid listing data.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create a booking with default dates (today + 1 day)
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Calculate duration in days
      const duration = Math.ceil((tomorrow.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      const bookingData = {
        user_id: user.id,
        owner_id: listing.owner?.id || 'unknown',
        listing_id: listing.id,
        start_date: today.toISOString(),
        end_date: tomorrow.toISOString(),
        total_price: listing.price * duration,
        status: 'pending' as const,
        payment_status: 'pending' as const,
        notes: `Booking for ${listing.title}. Location: ${listing.location}. Category: ${listing.category}.`
      }

      const renterName = user.fullName || user.firstName || 'User'
      const result = await bookingsDB.createBooking(bookingData, renterName, listing.title)

      if (!result.success) {
        throw new Error('Failed to create booking in database')
      }

      const bookingId = result.id

      // Send booking confirmation email
      fetch('/api/emails/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.emailAddresses[0]?.emailAddress,
          userName: user.firstName || 'there',
          booking: {
            id: bookingId || 'pending',
            itemName: listing.title,
            itemImage: listing.image,
            startDate: today.toISOString(),
            endDate: tomorrow.toISOString(),
            totalPrice: listing.price * duration,
            ownerName: listing.owner?.name || 'Owner',
            ownerEmail: 'owner@example.com'
          }
        })
      }).catch(err => console.error('Booking email error:', err))

      // Add a persistent notification for the booking
      addNotification({
        userId: user.id,
        type: NotificationType.BOOKING_REQUEST,
        title: 'Booking Request Sent!',
        message: `Your booking request for "${listing.title}" has been sent to the owner.`,
        link: `/profile/bookings`,
        isRead: false
      })

      console.log('Booking created successfully with ID:', bookingId)

      // Enhanced booking success notification
      const bookingToast = toast({
        title: "🎉 Booking Successful!",
        description: `"${listing.title}" booked for ${duration} day${duration > 1 ? 's' : ''}`,
        duration: 3000,
        action: (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                bookingToast.dismiss()
                router.push('/profile/bookings')
              }}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              View Bookings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => bookingToast.dismiss()}
              className="text-xs sm:text-sm px-2 sm:px-3"
            >
              Dismiss
            </Button>
          </div>
        ),
      })

      // Show browser notification
      try {
        await notificationService.showBookingSuccessNotification(listing.title, duration)
      } catch (error) {
        console.log('Browser notification not available:', error)
      }

      // Auto-dismiss toast and redirect after delay
      setTimeout(() => {
        bookingToast.dismiss()
        router.push('/profile/bookings')
      }, 4000)
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: "Error creating booking",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-8 sm:py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20 transition-all duration-500">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <PageHeader
          title="Browse Listings"
          description="Find the perfect rental from thousands of verified listings"
          breadcrumbs={[{ label: "Listings" }]}
          className="mb-8"
        />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          onFilterClick={() => setShowFilters(!showFilters)}
          showFilters={true}
          className="mb-8"
        />

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="flex gap-2 sm:gap-3 min-w-max">
            {categories.map((category, index) => {
              const IconComponent = getCategoryIcon(category.id)
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "h-10 sm:h-12 rounded-full px-4 sm:px-6 transition-all duration-300",
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg scale-105 border-0"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
                  )}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.name}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-2 text-xs py-0.5 px-1.5 rounded-full",
                      selectedCategory === category.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    )}
                  >
                    {category.count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Filter Panel - Sidebar on Desktop, Modal on Mobile */}
          <div className={cn(
            "lg:w-80 flex-shrink-0 transition-all duration-300 ease-in-out",
            showFilters ? "lg:block" : "lg:hidden"
          )}>
            <div className="sticky top-24">
              <FilterPanel
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                sortBy={sortBy}
                onSortChange={setSortBy}
                ratingFilter={ratingFilter}
                onRatingChange={setRatingFilter}
                availabilityFilter={availabilityFilter}
                onAvailabilityChange={setAvailabilityFilter}
                onReset={() => {
                  setLocationFilter("")
                  setAvailabilityFilter("any")
                  setDateRange(undefined)
                  setRatingFilter("any")
                  setPriceRange({ min: 0, max: 100000 })
                  setSortBy("newest")
                }}
                className="h-full"
              />
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {listings.length} {listings.length === 1 ? 'Result' : 'Results'} Found
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">View:</span>
                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "h-8 w-8 p-0 rounded-md",
                      viewMode === "grid" ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400" : "text-gray-500"
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "h-8 w-8 p-0 rounded-md",
                      viewMode === "list" ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400" : "text-gray-500"
                    )}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <LoadingState key={i} className="h-[400px] rounded-2xl" />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                  : "grid-cols-1"
              )}>
                {listings.map((listing, index) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    isLiked={listing.id ? interactions[listing.id]?.liked : false}
                    isSaved={listing.id ? interactions[listing.id]?.saved : false}
                    isLoadingInteraction={listing.id ? interactions[listing.id]?.loading : false}
                    onLike={handleLike}
                    onSave={handleSave}
                    onShare={handleShare}
                    onBook={handleBookNow}
                    onViewDetails={handleViewDetails}
                    onMessageOwner={(l) => {
                      const messagesUrl = `/messages?owner=${encodeURIComponent(l.owner?.name || 'Unknown')}&listing=${encodeURIComponent(l.title)}&ownerId=${l.owner?.id || 'unknown'}`
                      router.push(messagesUrl)
                    }}
                    className={cn(
                      "h-full fade-in-up",
                      viewMode === "list" ? "flex-row" : ""
                    )}
                    priority={index < 4}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Search className="h-10 w-10" />}
                title="No listings found"
                description="Try adjusting your search criteria or browse all categories."
                action={
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                      setLocationFilter("")
                      setAvailabilityFilter("any")
                      setRatingFilter("any")
                      setPriceRange({ min: 0, max: 100000 })
                    }}
                  >
                    Clear Filters
                  </Button>
                }
                className="py-12"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
