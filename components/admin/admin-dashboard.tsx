"use client"

import {
  Users,
  UserCheck,
  UserPlus,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Clock,
  Star,
  ArrowUpRight,
  UserCog,
  Key
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { getAdminDashboardData } from "@/lib/actions/dashboard-actions"
import { LoadingLogo } from "@/components/ui/loading-logo"
import { DashboardWelcomeHeader } from "@/components/dashboard/dashboard-welcome-header"
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card"
import { supabase } from "@/lib/supabase"

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalAffiliates: 0,
    totalStaff: 0,
    pendingVerifications: 0,
    activeListings: 0,
    totalBookings: 0,
    totalRevenue: 0,
    suspendedAccounts: 0,
    totalReviews: 0,
  })

  const [pendingVerifications, setPendingVerifications] = useState<any[]>([])
  const [suspendedUsers, setSuspendedUsers] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    let mounted = true

    async function loadStats() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (mounted) setUser(user)

        const { stats: s, pendingVerifications: pV, suspendedUsers: sU, activities } = await getAdminDashboardData()

        if (!mounted) return

        setStats(s)
        setPendingVerifications(pV || [])
        setSuspendedUsers(sU || [])
        setRecentActivity(activities || [])

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
    <div className="space-y-8 pb-10">
      {/* Unified Welcome Header */}
      <DashboardWelcomeHeader
        user={user}
        subtitle="Overview of platform administration and management"
        role="Admin"
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="indigo"
          description="+12% from last month"
        />
        <DashboardStatCard
          title="Active Owners"
          value={stats.totalOwners}
          icon={UserCheck}
          color="warm-blend"
          description="Verified hosts"
        />
        <DashboardStatCard
          title="Affiliates"
          value={stats.totalAffiliates}
          icon={UserPlus}
          color="rose-highlight"
          description="Marketing partners"
        />
        <DashboardStatCard
          title="Staff Team"
          value={stats.totalStaff}
          icon={UserCog}
          color="purple"
          description="Active support team"
        />
        <DashboardStatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={Star}
          color="amber-glow"
          description={`Avg. Rating: 4.8`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Verifications */}
        <Card className="glass-card border-none shadow-md overflow-hidden">
          <CardHeader className="bg-white/50 dark:bg-black/20 border-b border-border/50">
            <div className="flex flex-row items-center justify-between">
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
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {pendingVerifications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pending verifications</p>
              ) : (
                pendingVerifications.slice(0, 4).map((user) => {
                  const daysLeft = user.verificationDeadline
                    ? Math.ceil((user.verificationDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    : 0
                  const isUrgent = daysLeft <= 2

                  return (
                    <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-3 sm:gap-0">
                      <div className="flex items-center gap-3 w-full sm:w-auto">
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
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                              {user.role}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
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
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/users/${user.id}`}>Review</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Suspended Accounts */}
        <Card className="glass-card border-none shadow-md overflow-hidden">
          <CardHeader className="bg-white/50 dark:bg-black/20 border-b border-border/50">
            <div className="flex flex-row items-center justify-between">
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
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {suspendedUsers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No suspended accounts</p>
              ) : (
                suspendedUsers.map((user) => (
                  <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-3 sm:gap-0">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
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
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                            {user.role}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                      <Badge variant="destructive">Suspended</Badge>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/users/${user.id}`}>Review</Link>
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
      <Card className="glass-card border-none shadow-md overflow-hidden">
        <CardHeader className="bg-white/50 dark:bg-black/20 border-b border-border/50">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-2 sm:gap-0">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 ${activity.type === "suspension"
                      ? "bg-red-500 ring-red-100"
                      : activity.type === "verification"
                        ? "bg-orange-500 ring-orange-100"
                        : activity.type === "booking"
                          ? "bg-green-500 ring-green-100"
                          : "bg-blue-500 ring-blue-100"
                      }`}
                  />
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap w-full sm:w-auto text-left sm:text-right mt-1 sm:mt-0">{formatDistanceToNow(new Date(activity.time), { addSuffix: true })}</span>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-center text-muted-foreground py-8">No recent activity</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
