"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase"
import { getNotifications, markNotificationAsRead } from "@/lib/actions/dashboard-actions"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        // Fallback to metadata if profile incomplete
        const meta = user.user_metadata || {}
        setProfile({
          ...profileData,
          full_name: profileData?.full_name || meta.full_name || meta.name || user.email?.split('@')[0],
          email: profileData?.email || user.email,
          avatar_url: profileData?.avatar_url || meta.avatar_url || meta.picture
        })

        // Fetch notifications
        try {
          const notifs = await getNotifications(user.id)
          setNotifications(notifs || [])
          setUnreadCount(notifs?.filter((n: any) => !n.is_read).length || 0)
        } catch (e) {
          console.error("Error fetching notifications", e)
        }
      }
    }
    getData()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  return (
    <header className="sticky top-0 z-40 h-14 md:h-16 border-b border-border bg-card/50 backdrop-blur-xl px-3 md:px-6 flex items-center justify-between">
      {/* Search - Hidden on mobile */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search listings, bookings..." className="pl-10 bg-background/50" />
        </div>
      </div>

      {/* Logo/Title on mobile */}
      <div className="md:hidden flex-1">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="touch-target">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
            ) : (
              notifications.map((notif: any) => (
                <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 cursor-pointer" onClick={() => handleMarkAsRead(notif.id)}>
                  <div className="flex justify-between w-full">
                    <span className={`font-medium ${!notif.is_read ? 'text-primary' : ''}`}>{notif.title}</span>
                    {!notif.is_read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{notif.message}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || "/african-man-portrait.png"} />
                <AvatarFallback>{profile?.full_name?.[0] || profile?.email?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{profile?.full_name || 'User'}</span>
                <span className="text-xs text-muted-foreground">{profile?.email || ''}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/users/${profile?.id}`)}>View Public Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
