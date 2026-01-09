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
import { getAdminDashboardData } from "@/lib/actions/dashboard-actions"

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
        const { stats: s, pendingVerifications: pV, suspendedUsers: sU, activities } = await getAdminDashboardData()

        if (!mounted) return

        setStats(s)
        setPendingVerifications(pV || [])
        setSuspendedUsers(sU || [])
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
