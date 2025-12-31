"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { CalendarCheck, Clock, CheckCircle, XCircle, MessageCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { getBookings } from "@/lib/actions/dashboard-actions"
import { LeaveReviewDialog } from "@/components/dashboard/leave-review-dialog"

export function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Fetch current profile to determine role
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single()

          const role = profile?.role || 'renter'
          const data = await getBookings(user.id, role as 'owner' | 'renter')
          setBookings(data || [])
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage your rental bookings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/20">
                <CalendarCheck className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-500/20">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-500/20">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.cancelled}</p>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>View and manage your rental requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                    <div className="relative w-24 h-16 mr-1">
                      <Image
                        src={booking.listing?.images?.[0] || "/placeholder.svg"}
                        alt={booking.listing?.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{booking.listing?.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={booking.renter?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{booking.renter?.full_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{booking.renter?.full_name || 'Renter'}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status)}
                      <p className="font-semibold mt-1">KSh {booking.total_amount?.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      {booking.status === "completed" && (
                        <LeaveReviewDialog
                          bookingId={booking.id}
                          listingId={booking.listing_id}
                          listingTitle={booking.listing?.title}
                          listingImage={booking.listing?.images?.[0]}
                        >
                          <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                            Leave Review
                          </Button>
                        </LeaveReviewDialog>
                      )}
                      {booking.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                            Accept
                          </Button>
                          <Button size="sm" variant="destructive">
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <div className="space-y-4">
                {bookings.filter(b => b.status === "pending").map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                    <p className="font-semibold">{booking.listing?.title}</p>
                    {/* Simplified View for pending tab or reuse component */}
                    <Badge className="ml-auto bg-orange-500/20 text-orange-600">Pending</Badge>
                  </div>
                ))}
                {stats.pending === 0 && <p className="text-muted-foreground text-center py-8">No pending bookings</p>}
              </div>
            </TabsContent>
            <TabsContent value="confirmed" className="mt-4">
              <div className="space-y-4">
                {bookings.filter(b => b.status === "confirmed").map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                    <p className="font-semibold">{booking.listing?.title}</p>
                    <Badge className="ml-auto bg-green-500/20 text-green-600">Confirmed</Badge>
                  </div>
                ))}
                {bookings.filter(b => b.status === 'confirmed').length === 0 && <p className="text-muted-foreground text-center py-8">No confirmed bookings</p>}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <div className="space-y-4">
                {bookings.filter(b => b.status === "completed").map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 rounded-lg bg-background/50">
                    <p className="font-semibold">{booking.listing?.title}</p>
                    <Badge className="ml-auto bg-blue-500/20 text-blue-600">Completed</Badge>
                  </div>
                ))}
                {stats.completed === 0 && <p className="text-muted-foreground text-center py-8">No completed bookings</p>}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div >
  )
}
