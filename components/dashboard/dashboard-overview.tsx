"use client"

import { Package, CalendarCheck, DollarSign, TrendingUp, Eye, Star, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export function DashboardOverview() {
  const stats = [
    { title: "Active Listings", value: "8", icon: Package, change: "+2 this month", color: "text-blue-500" },
    { title: "Total Bookings", value: "24", icon: CalendarCheck, change: "+5 this week", color: "text-green-500" },
    {
      title: "Total Earnings",
      value: "KSh 245,000",
      icon: DollarSign,
      change: "+18% this month",
      color: "text-primary",
    },
    { title: "Profile Views", value: "1,234", icon: Eye, change: "+12% this week", color: "text-purple-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, John</h1>
          <p className="text-muted-foreground">Here is what is happening with your rentals today</p>
        </div>
        <Button className="bg-primary text-primary-foreground" asChild>
          <Link href="/dashboard/listings/new">Create Listing</Link>
        </Button>
      </div>

      {/* Verification Warning */}
      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-orange-500/10">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-600 mb-1">Complete Your Verification</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your account is pending verification. Submit your documents to avoid suspension.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">3 days remaining</span>
                </div>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" asChild>
                  <Link href="/dashboard/verification">Complete Verification</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Your latest rental requests</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/bookings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  item: "Toyota Land Cruiser",
                  renter: "Grace Muthoni",
                  dates: "Dec 10-15",
                  status: "confirmed",
                  amount: 75000,
                },
                {
                  item: "3BR Apartment",
                  renter: "Peter Ochieng",
                  dates: "Dec 12-19",
                  status: "pending",
                  amount: 56000,
                },
                {
                  item: "DJ Equipment Set",
                  renter: "James Kiprop",
                  dates: "Dec 14",
                  status: "confirmed",
                  amount: 12000,
                },
              ].map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div>
                    <p className="font-medium">{booking.item}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.renter} - {booking.dates}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        booking.status === "confirmed"
                          ? "bg-green-500/20 text-green-600"
                          : "bg-orange-500/20 text-orange-600"
                      }
                    >
                      {booking.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">KSh {booking.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Listings */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Listings</CardTitle>
              <CardDescription>Your best performing rentals</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/listings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Toyota Land Cruiser V8", views: 456, bookings: 12, rating: 4.8 },
                { title: "Modern 3BR Apartment", views: 389, bookings: 8, rating: 4.9 },
                { title: "DJ Equipment Set", views: 234, bookings: 15, rating: 4.5 },
              ].map((listing, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-muted-foreground w-8">#{index + 1}</div>
                  <div className="flex-1">
                    <p className="font-medium">{listing.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{listing.views} views</span>
                      <span>{listing.bookings} bookings</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{listing.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Status */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Your current plan and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge className="bg-primary mb-2">Weekly Plan</Badge>
              <p className="text-sm text-muted-foreground">Expires in 4 days</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/subscription">Upgrade Plan</Link>
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Listings Used</span>
              <span className="font-medium">8 / 10</span>
            </div>
            <Progress value={80} className="h-2" />
            <p className="text-xs text-muted-foreground">You have 2 listing slots remaining</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
