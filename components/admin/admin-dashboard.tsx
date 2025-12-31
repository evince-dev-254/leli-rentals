"use client"

import {
  Users,
  UserCheck,
  UserPlus,
  ShieldAlert,
  Package,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  Star, // Added Star icon
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import { LoadingLogo } from "@/components/ui/loading-logo"

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalAffiliates: 0,
    pendingVerifications: 0,
    activeListings: 0,
    totalBookings: 0,
    totalRevenue: 0,
    suspendedAccounts: 0,
    totalReviews: 0, // Added totalReviews to stats state
  })

  const [pendingVerifications, setPendingVerifications] = useState<any[]>([])
  const [suspendedUsers, setSuspendedUsers] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    let mounted = true

    async function loadStats() {
      try {
        // counts
        const [
          { data: tu, error: tuErr, count: totalUsers },
          { data: ownersData, error: ownersErr, count: totalOwners },
          { data: affiliatesData, error: affErr, count: totalAffiliates },
          { data: listingsData, error: listingsErr, count: activeListings },
          { data: bookingsData, error: bookingsErr, count: totalBookings },
          { data: reviewsData, error: reviewsErr, count: totalReviews }, // Added reviews count fetch
        ] = await Promise.all([
          supabase.from("user_profiles").select("id", { count: "exact", head: true }),
          supabase.from("user_profiles").select("id", { count: "exact", head: true }).eq("role", "owner"),
          supabase.from("user_profiles").select("id", { count: "exact", head: true }).eq("role", "affiliate"),
          supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "approved"),
          supabase.from("bookings").select("id", { count: "exact", head: true }),
          supabase.from("reviews").select("id", { count: "exact", head: true }), // Fetch reviews count
        ])

        // compute total revenue from bookings
        const { data: revenueRows, error: revenueErr } = await supabase.from("bookings").select("total_amount")
        const totalRevenue = revenueErr ? 0 : (revenueRows || []).reduce((s: number, r: any) => s + Number(r.total_amount || 0), 0)

        const { data: suspended, error: suspendedErr } = await supabase.from("user_profiles").select("*").eq("account_status", "suspended").limit(5)
        const { data: pendingV, error: pendingVErr } = await supabase
          .from("user_profiles")
          .select("*")
          .or("account_status.eq.pending_verification,role.eq.owner,role.eq.affiliate")
          .limit(5)

        // Fetch recent activities
        const { data: recentUsers } = await supabase.from('user_profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false }).limit(5)
        const { data: recentListings } = await supabase.from('listings').select('id, title, owner_id, created_at').order('created_at', { ascending: false }).limit(5)
        const { data: recentBookings } = await supabase.from('bookings').select('id, listing_id, renter_id, created_at, total_amount').order('created_at', { ascending: false }).limit(5)

        // Combine and format activities
        const activities = [
          ...(recentUsers || []).map((u: any) => ({
            type: 'user',
            action: `New ${u.role} registration`,
            user: u.full_name || 'Unknown User',
            time: u.created_at,
            details: u.role
          })),
          ...(recentListings || []).map((l: any) => ({
            type: 'listing',
            action: 'New listing created',
            user: l.title, // Using title as "user" field for layout compatibility or we can fetch owner name
            time: l.created_at,
            details: l.title
          })),
          ...(recentBookings || []).map((b: any) => ({
            type: 'booking',
            action: 'New booking',
            user: `Booking #${b.id.slice(0, 8)} `,
            time: b.created_at,
            details: `KSh ${b.total_amount} `
          }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10)


        if (!mounted) return

        setStats({
          totalUsers: Number(totalUsers) || 0,
          totalOwners: Number(totalOwners) || 0,
          totalAffiliates: Number(totalAffiliates) || 0,
          pendingVerifications: (pendingV && pendingV.length) || 0,
          activeListings: Number(activeListings) || 0,
          totalBookings: Number(totalBookings) || 0,
          totalRevenue,
          suspendedAccounts: (suspended && suspended.length) || 0,
          totalReviews: Number(totalReviews) || 0, // Set totalReviews
        })

        setPendingVerifications(pendingV || [])
        setSuspendedUsers(suspended || [])
        setRecentActivity(activities)

      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadStats()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingLogo size={60} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here is what is happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Owners</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOwners}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Affiliates</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAffiliates}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+15% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verifications</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Recent changes</span>
            </div>
          </CardContent>
        </Card>

        {/* New Card for Total Reviews */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">+10% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Verifications */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-orange-500" />
                Pending Verifications
              </CardTitle>
              <CardDescription>Users awaiting document verification</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/verifications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.slice(0, 4).map((user) => {
                const daysLeft = user.verificationDeadline
                  ? Math.ceil((user.verificationDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : 0
                const isUrgent = daysLeft <= 2

                return (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {(user.fullName || "User")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          user.verificationStatus === "submitted"
                            ? "default"
                            : user.verificationStatus === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {user.verificationStatus}
                      </Badge>
                      {daysLeft > 0 && (
                        <Badge variant={isUrgent ? "destructive" : "outline"} className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {daysLeft}d left
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Suspended Accounts */}
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Suspended Accounts
              </CardTitle>
              <CardDescription>Accounts suspended due to verification issues</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/users?status=suspended">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suspendedUsers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No suspended accounts</p>
              ) : (
                suspendedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {(user.fullName || "User")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Suspended</Badge>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${activity.type === "suspension"
                      ? "bg-red-500"
                      : activity.type === "verification"
                        ? "bg-orange-500"
                        : activity.type === "booking"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                  />
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(activity.time), { addSuffix: true })}</span>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-center text-muted-foreground">No recent activity</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
