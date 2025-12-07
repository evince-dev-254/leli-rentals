"use client"

import { useState, useEffect } from "react"
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

export function AdminHeader() {
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }

      // Fetch Notifications
      const { data: pendingDocs } = await supabase
        .from('user_profiles')
        .select('full_name, created_at')
        .in('account_status', ['pending_verification'])
        .order('created_at', { ascending: false })
        .limit(5)

      const { data: newSignups } = await supabase
        .from('user_profiles')
        .select('full_name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      const notifs = [
        ...(pendingDocs || []).map((d: any) => ({
          title: "New Verification Pending",
          message: `${d.full_name} submitted documents`,
          time: d.created_at,
          type: 'verification'
        })),
        ...(newSignups || []).filter((u: any) => new Date(u.created_at) > new Date(Date.now() - 86400000)).map((u: any) => ({ // Last 24h
          title: `New ${u.role} Signup`,
          message: `${u.full_name} joined as ${u.role}`,
          time: u.created_at,
          type: 'signup'
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)

      setNotifications(notifs)
    }
    loadData()
  }, [])

  const initial = profile?.full_name ? profile.full_name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'A')

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/50 backdrop-blur-xl px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users, listings..." className="pl-10 bg-background/50" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">{notifications.length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
            ) : (
              notifications.map((notif, i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 cursor-pointer">
                  <span className="font-medium">{notif.title}</span>
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
                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{profile?.full_name || 'Admin'}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Activity Log</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={async () => {
                await supabase.auth.signOut()
                window.location.href = "/" // Force full reload to clear state
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
