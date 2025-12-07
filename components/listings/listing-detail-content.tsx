"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getCategoryById } from "@/lib/categories-data"
import { useFavorites } from "@/lib/favorites-context"
import { useMessages } from "@/lib/messages-context"
import { BookingModal } from "@/components/booking/booking-modal"
import type { Listing } from "@/lib/listings-data"

interface ListingDetailContentProps {
  listing: Listing
}

export function ListingDetailContent({ listing }: ListingDetailContentProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedDates, setSelectedDates] = useState<Date | undefined>()
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")

  const { isFavorite, toggleFavorite } = useFavorites()
  const { startConversation } = useMessages()
  const isLiked = isFavorite(listing.id)

  // MOCK: Get user role (replace with actual auth hook when available)
  // Options: "renter", "owner", "admin"
  const currentUserRole = "renter"
  const isRenter = currentUserRole === "renter"

  const category = getCategoryById(listing.category)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length)
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
    <div className="gradient-mesh min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href={`/categories/${listing.category}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {category?.name}
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden glass-card">
              <img
                src={listing.images[currentImageIndex] || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-full object-cover"
              />

              {listing.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {listing.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                          }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Action Buttons - Use favorites context */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={() => toggleFavorite(listing.id)}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {listing.isFeatured && <Badge className="bg-primary">Featured</Badge>}
                {listing.isVerified && (
                  <Badge className="bg-green-500">
                    <Shield className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
            </div>

            {/* Title and Info */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {listing.subcategory}
                  </Badge>
                  <h1 className="text-2xl sm:text-3xl font-bold">{listing.title}</h1>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.location}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                      <span className="font-medium text-foreground">{listing.rating}</span>
                      <span className="ml-1">({listing.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Tabs */}
              <Tabs defaultValue="description">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4">
                  <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
                </TabsContent>

                <TabsContent value="amenities" className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-4">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/diverse-group.png?height=40&width=40&query=person ${i}`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">User {i}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`h-3 w-3 ${idx < 5 - i + 3 ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Great experience! The item was exactly as described and the owner was very responsive.
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Owner Info - Add chat functionality */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">About the Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={listing.ownerAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {listing.ownerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{listing.ownerName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                        {listing.ownerRating} ({listing.ownerReviews} reviews)
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-green-500 mr-1" />
                        Verified Owner
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setIsChatOpen(true)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">KSh {listing.pricePerDay.toLocaleString()}</span>
                  <span className="text-muted-foreground">/day</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-muted-foreground">Weekly</p>
                    <p className="font-semibold">KSh {listing.pricePerWeek.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-muted-foreground">Monthly</p>
                    <p className="font-semibold">KSh {listing.pricePerMonth.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Calendar */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Check Availability
                </h4>
                <CalendarComponent
                  mode="single"
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-green-500/10 text-green-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Available Now</span>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  onClick={() => setIsBookingOpen(true)}
                  disabled={!isRenter}
                >
                  {isRenter ? "Book Now" : "Owner Account (View Only)"}
                </Button>
                {!isRenter && (
                  <p className="text-xs text-center text-destructive">
                    Only renter accounts can make bookings.
                  </p>
                )}
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsChatOpen(true)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Owner
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-3">You will not be charged yet</p>

              <div className="mt-6 pt-6 border-t">
                <Button variant="ghost" className="w-full justify-center" onClick={() => toggleFavorite(listing.id)}>
                  <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  {isLiked ? "Saved to Favorites" : "Save to Favorites"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal listing={listing} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />

      {/* Chat Modal */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message {listing.ownerName}</DialogTitle>
            <DialogDescription>Send a message about {listing.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
              <img
                src={listing.images[0] || "/placeholder.svg"}
                alt={listing.title}
                className="w-16 h-12 object-cover rounded"
              />
              <div>
                <p className="font-medium text-sm">{listing.title}</p>
                <p className="text-xs text-muted-foreground">KSh {listing.pricePerDay.toLocaleString()}/day</p>
              </div>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Hi, I'm interested in renting this item..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <p className="text-xs text-muted-foreground">
                Ask about availability, pickup details, or any questions you have.
              </p>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              onClick={handleSendMessage}
              disabled={!chatMessage.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
