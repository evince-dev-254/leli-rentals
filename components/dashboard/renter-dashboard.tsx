"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { getBookings } from "@/lib/actions/dashboard-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, CalendarCheck, Heart, Star, MessageCircle, MapPin } from "lucide-react"
import Link from "next/link"
import { LeaveReviewDialog } from "./leave-review-dialog"
import { LoadingLogo } from "@/components/ui/loading-logo"

export function RenterDashboard() {
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState<any[]>([])
    const [favorites, setFavorites] = useState<any[]>([])
    const [reviews, setReviews] = useState<any[]>([])
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)

                // 1. Fetch Bookings
                const b = await getBookings(user.id, 'renter')
                setBookings(b || [])

                // 2. Fetch Favorites
                const { data: favs } = await supabase
                    .from('favorites')
                    .select(`
                    id,
                    listing:listings (
                        id, title, price_per_day, images, location, rating_average
                    )
                `)
                    .eq('user_id', user.id)
                setFavorites(favs || [])

                // 3. Fetch My Reviews
                const { data: revs } = await supabase
                    .from('reviews')
                    .select(`
                    *,
                    listing:listings (title, images)
                `)
                    .eq('reviewer_id', user.id)
                setReviews(revs || [])
            }
            setLoading(false)
        }
        init()
    }, [])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed": return <Badge className="bg-green-500/20 text-green-600">Confirmed</Badge>
            case "pending": return <Badge className="bg-orange-500/20 text-orange-600">Pending</Badge>
            case "completed": return <Badge className="bg-blue-500/20 text-blue-600">Completed</Badge>
            case "cancelled": return <Badge className="bg-red-500/20 text-red-600">Cancelled</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <LoadingLogo size={60} />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Renter Dashboard</h1>
                <p className="text-muted-foreground">Manage your trips, favorites, and reviews</p>
            </div>

            <Tabs defaultValue="bookings" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="bookings" className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4" />
                        My Bookings
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Favorites
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        My Reviews
                    </TabsTrigger>
                </TabsList>

                {/* BOOKINGS TAB */}
                <TabsContent value="bookings">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Booking History</CardTitle>
                            <CardDescription>View status of your rental requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">You haven't made any bookings yet.</p>
                                    <Button className="mt-4" asChild>
                                        <Link href="/categories">Browse Listings</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-background/50 border border-border">
                                            <img
                                                src={booking.listing?.images?.[0] || "/placeholder.svg"}
                                                alt={booking.listing?.title}
                                                className="w-full md:w-48 h-32 object-cover rounded-lg"
                                            />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{booking.listing?.title}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(booking.status)}
                                                </div>

                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-muted-foreground">Owner:</span>
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarImage src={booking.owner?.avatar_url} />
                                                        <AvatarFallback>O</AvatarFallback>
                                                    </Avatar>
                                                    <span>{booking.owner?.full_name || 'Unknown'}</span>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <p className="font-semibold">Total: KSh {booking.total_amount?.toLocaleString()}</p>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href="/messages">
                                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                                Chat Owner
                                                            </Link>
                                                        </Button>
                                                        {booking.status === 'completed' && (
                                                            <LeaveReviewDialog
                                                                bookingId={booking.id}
                                                                listingId={booking.listing?.id}
                                                                listingTitle={booking.listing?.title}
                                                                listingImage={booking.listing?.images?.[0]}
                                                                onReviewSubmitted={() => window.location.reload()} // Simple reload to refresh 'My Reviews' tab
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FAVORITES TAB */}
                <TabsContent value="favorites">
                    {favorites.length === 0 ? (
                        <div className="text-center py-12 glass-card rounded-lg">
                            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No favorites yet</h3>
                            <p className="text-muted-foreground">Save listings you like to view them here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((fav: any) => (
                                <Link key={fav.id} href={`/listings/${fav.listing.id}`} className="block group">
                                    <Card className="glass-card overflow-hidden hover:ring-2 ring-primary/50 transition-all">
                                        <div className="aspect-video relative">
                                            <img
                                                src={fav.listing.images?.[0] || "/placeholder.svg"}
                                                alt={fav.listing.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 right-2 p-2 bg-white/80 rounded-full">
                                                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold truncate">{fav.listing.title}</h3>
                                            <div className="flex items-center gap-1 text-sm text-yellow-500 my-1">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span>{fav.listing.rating_average || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                                                <MapPin className="h-3 w-3" />
                                                {fav.listing.location}
                                            </div>
                                            <p className="font-bold text-primary">KSh {fav.listing.price_per_day?.toLocaleString()}/day</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* REVIEWS TAB */}
                <TabsContent value="reviews">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>My Reviews</CardTitle>
                            <CardDescription>Reviews you've left for items</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {reviews.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">You haven't left any reviews yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="p-4 rounded-lg bg-background/50 border border-border">
                                            <div className="flex gap-4">
                                                <img
                                                    src={review.listing?.images?.[0]}
                                                    className="w-16 h-16 rounded object-cover"
                                                    alt="Item"
                                                />
                                                <div>
                                                    <h4 className="font-medium">{review.listing?.title}</h4>
                                                    <div className="flex items-center gap-1 text-yellow-500 my-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                                                    <p className="text-xs text-muted-foreground mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    )
}
