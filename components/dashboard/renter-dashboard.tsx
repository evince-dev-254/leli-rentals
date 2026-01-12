"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { getBookings } from "@/lib/actions/dashboard-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, CalendarCheck, Heart, Star, MessageCircle, MapPin, Search, ArrowUpRight, DollarSign, Wallet } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { LeaveReviewDialog } from "./leave-review-dialog"
import { LoadingLogo } from "@/components/ui/loading-logo"
import { DashboardWelcomeHeader } from "@/components/dashboard/dashboard-welcome-header"

export function RenterDashboard() {
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState<any[]>([])
    const [favorites, setFavorites] = useState<any[]>([])
    const [reviews, setReviews] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)

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
            case "confirmed": return <Badge className="bg-green-500/20 text-green-600 dark:bg-green-900/30 dark:text-green-400">Confirmed</Badge>
            case "pending": return <Badge className="bg-orange-500/20 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">Pending</Badge>
            case "completed": return <Badge className="bg-blue-500/20 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">Completed</Badge>
            case "cancelled": return <Badge className="bg-red-500/20 text-red-600 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>
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

    // Filter for payments: Bookings that are confirmed or completed (assuming payment happened)
    const paymentHistory = bookings.filter(b => ['confirmed', 'completed'].includes(b.status));

    return (
        <div className="container mx-auto py-4 md:py-8 px-2 sm:px-4 space-y-6 md:space-y-8 pb-20">
            <DashboardWelcomeHeader
                user={user}
                subtitle="Manage your bookings, payments, and favorite items."
                role="Renter"
            />

            <Tabs defaultValue="bookings" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 overflow-x-auto flex w-full justify-start md:justify-center md:hidden">
                    <TabsTrigger value="bookings" className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4" />
                        Bookings
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Payments
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Favorites
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Reviews
                    </TabsTrigger>
                </TabsList>

                <TabsList className="bg-muted/50 p-1 hidden md:inline-flex">
                    <TabsTrigger value="bookings" className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4" />
                        Bookings
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        Payments
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Favorites
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Reviews
                    </TabsTrigger>
                </TabsList>

                {/* BOOKINGS TAB */}
                <TabsContent value="bookings">
                    <Card className="glass-card border-none shadow-md">
                        <CardHeader className="p-4 md:p-6">
                            <CardTitle className="text-xl md:text-2xl">My Bookings</CardTitle>
                            <CardDescription className="text-xs md:text-sm">Track the status of your rental requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg">No bookings yet</h3>
                                    <p className="text-muted-foreground mb-6">Find something you need and make your first booking!</p>
                                    <Button size="lg" asChild>
                                        <Link href="/categories">Browse Listings</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-background/50 border border-border/50 shadow-sm hover:shadow-md transition-all">
                                            <div className="relative w-full md:w-48 h-32 shrink-0">
                                                {booking.listing?.images?.[0] ? (
                                                    <img
                                                        src={booking.listing.images[0]}
                                                        alt={booking.listing?.title || "Listing"}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/placeholder.svg'
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
                                                        <CalendarCheck className="h-8 w-8 opacity-20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg line-clamp-1">{booking.listing?.title}</h3>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <CalendarCheck className="h-3 w-3" />
                                                            {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(booking.status)}
                                                </div>

                                                <div className="flex items-center gap-2 text-sm pt-1">
                                                    <span className="text-muted-foreground">Owner:</span>
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarImage src={booking.owner?.avatar_url} />
                                                        <AvatarFallback>O</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{booking.owner?.full_name || 'Unknown'}</span>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-2 border-t border-border/30">
                                                    <p className="font-bold text-lg">KSh {booking.total_amount?.toLocaleString()}</p>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href="/messages">
                                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                                Message
                                                            </Link>
                                                        </Button>
                                                        {booking.status === 'completed' && (
                                                            <LeaveReviewDialog
                                                                bookingId={booking.id}
                                                                listingId={booking.listing?.id}
                                                                listingTitle={booking.listing?.title}
                                                                listingImage={booking.listing?.images?.[0]}
                                                                onReviewSubmitted={() => window.location.reload()}
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

                {/* PAYMENTS TAB */}
                <TabsContent value="payments">
                    <Card className="glass-card border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                            <CardDescription>Record of your completed transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {paymentHistory.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg">No payments recorded</h3>
                                    <p className="text-muted-foreground">Payments for confirmed bookings will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-0 divide-y divide-border/50">
                                    {paymentHistory.map((payment) => (
                                        <div key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-3">
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                                    <ArrowUpRight className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Payment for {payment.listing?.title}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(payment.start_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                                                <p className="font-bold text-foreground">- KSh {payment.total_amount?.toLocaleString()}</p>
                                                <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 dark:border-green-800">
                                                    Paid
                                                </Badge>
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
                            <Button className="mt-4" variant="secondary" asChild>
                                <Link href="/categories">Start Exploring</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((fav: any) => (
                                <Card key={fav.id} className="glass-card overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full border-none">
                                    <div className="aspect-video relative overflow-hidden">
                                        {fav.listing.images?.[0] ? (
                                            <img
                                                src={fav.listing.images[0]}
                                                alt={fav.listing.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder.svg'
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <Heart className="h-12 w-12 opacity-10" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-black/60 rounded-full backdrop-blur-sm z-10">
                                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                        </div>
                                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded backdrop-blur-md flex items-center gap-1 z-10">
                                            <MapPin className="h-3 w-3" />
                                            {fav.listing.location}
                                        </div>
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex-1">
                                            <Link href={`/listings/${fav.listing.id}`} className="hover:underline">
                                                <h3 className="font-semibold truncate text-lg">{fav.listing.title}</h3>
                                            </Link>
                                            <div className="flex items-center gap-1 text-sm text-yellow-500 my-1">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span>{fav.listing.rating_average || 0}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 border-t pt-4 border-dashed">
                                            <p className="font-bold text-xl text-primary">KSh {fav.listing.price_per_day?.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/day</span></p>
                                            <Button size="sm" asChild className="shadow-lg shadow-primary/20">
                                                <Link href={`/listings/${fav.listing.id}`}>
                                                    Book Now
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* REVIEWS TAB */}
                <TabsContent value="reviews">
                    <Card className="glass-card border-none shadow-md">
                        <CardHeader>
                            <CardTitle>My Reviews</CardTitle>
                            <CardDescription>Reviews you&apos;ve left for items</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {reviews.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">You haven&apos;t left any reviews yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="p-4 rounded-xl bg-background/50 border border-border/50">
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <div className="relative w-16 h-16 shrink-0">
                                                    {review.listing?.images?.[0] ? (
                                                        <img
                                                            src={review.listing.images[0]}
                                                            alt={review.listing?.title || "Item"}
                                                            className="w-full h-full rounded-lg object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/placeholder.svg'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-muted rounded-lg" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-lg">{review.listing?.title}</h4>
                                                    <div className="flex items-center gap-1 text-yellow-500 my-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground italic">&quot;{review.comment}&quot;</p>
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
