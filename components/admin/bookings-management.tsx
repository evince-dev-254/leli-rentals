"use client"

import { CalendarCheck, DollarSign, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const { data: bs, error: bsErr } = await supabase.from("bookings").select("*")
        if (bsErr) {
          console.error("Error fetching bookings:", bsErr)
          return
        }

        const listingIds = Array.from(new Set((bs || []).map((b: any) => b.listing_id).filter(Boolean)))
        const ownerIds = Array.from(new Set((bs || []).map((b: any) => b.renter_id).concat((bs || []).map((b: any) => b.owner_id)).filter(Boolean)))

        let ls: any[] = []
        let us: any[] = []

        if (listingIds.length > 0 || ownerIds.length > 0) {
          const promises = []
          if (listingIds.length > 0) {
            promises.push(supabase.from("listings").select("*").in("id", listingIds))
          } else {
            promises.push(Promise.resolve({ data: [], error: null }))
          }

          if (ownerIds.length > 0) {
            promises.push(supabase.from("user_profiles").select("*").in("id", ownerIds))
          } else {
            promises.push(Promise.resolve({ data: [], error: null }))
          }

          const [listingsRes, usersRes] = await Promise.all(promises)

          if (listingsRes.error) console.error("Error fetching listings for bookings:", listingsRes.error)
          if (usersRes.error) console.error("Error fetching users for bookings:", usersRes.error)

          ls = listingsRes.data || []
          us = usersRes.data || []
        }

        if (!mounted) return

        setBookings(bs || [])
        setListings(ls || [])
        setUsers(us || [])
      } catch (err) {
        console.error(err)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  const getListing = (listingId: string) => listings.find((l) => l.id === listingId)
  const getUser = (userId: string) => users.find((u) => u.id === userId)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground">Monitor and manage all rental bookings</p>
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
                <p className="text-2xl font-bold">{bookings.length}</p>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
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
                <p className="text-2xl font-bold">{bookings.filter((b) => b.status === "confirmed").length}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
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
                <p className="text-2xl font-bold">{bookings.filter((b) => b.status === "pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  KSh {bookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Complete list of all rental bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Listing</TableHead>
                <TableHead>Renter</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => {
                const listing = getListing(booking.listing_id)
                const renter = getUser(booking.renter_id)
                const owner = getUser(booking.owner_id)
                const startDate = booking.start_date ? new Date(booking.start_date) : null
                const endDate = booking.end_date ? new Date(booking.end_date) : null
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">{booking.id.substring(0, 8)}...</TableCell>
                    <TableCell className="font-medium">{listing?.title || 'N/A'}</TableCell>
                    <TableCell>{renter?.full_name || 'N/A'}</TableCell>
                    <TableCell>{owner?.full_name || 'N/A'}</TableCell>
                    <TableCell className="text-sm">
                      {startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : 'N/A'}
                    </TableCell>
                    <TableCell>KSh {Number(booking.total_amount || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-500/20 text-green-600"
                            : booking.status === "pending"
                              ? "bg-orange-500/20 text-orange-600"
                              : "bg-blue-500/20 text-blue-600"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.payment_status === "paid"
                            ? "bg-green-500/20 text-green-600"
                            : "bg-orange-500/20 text-orange-600"
                        }
                      >
                        {booking.payment_status || 'pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
