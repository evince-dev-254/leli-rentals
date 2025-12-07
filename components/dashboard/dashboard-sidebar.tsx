"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  CreditCard,
  DollarSign,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  MessageCircle,
  Receipt,
  Star,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const allLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["owner", "renter", "affiliate", "admin"] },
  { href: "/dashboard/listings", label: "My Listings", icon: Package, roles: ["owner", "renter", "admin"] }, // Renters asked for this, though strange without create
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck, roles: ["owner", "renter", "admin"] },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle, roles: ["owner", "renter", "admin"] },
  { href: "/dashboard/earnings", label: "Earnings", icon: DollarSign, roles: ["owner", "affiliate", "admin"] },
  { href: "/dashboard/affiliate/referrals", label: "My Referees", icon: Users, roles: ["affiliate"] },
  { href: "/dashboard/payments", label: "Payments", icon: Receipt, roles: ["renter"] }, // New for Renters
  { href: "/dashboard/reviews", label: "My Reviews", icon: Star, roles: ["renter"] },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard, roles: ["owner", "admin"] },
  { href: "/dashboard/verification", label: "Verification", icon: ShieldCheck, badge: "Pending", roles: ["owner", "affiliate"] }, // Removed for renter
  { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["owner", "renter", "affiliate", "admin"] },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
        setRole(data?.role || 'renter')
      }
      setLoading(false)
    }
    getRole()
  }, [])

  const filteredLinks = allLinks.filter(link => role && link.roles.includes(role))

  if (loading) return <div className="w-64 h-screen bg-card/50 border-r border-border" /> // Simple skeleton

  return (
    <aside
      className={cn(
        "hidden md:sticky md:flex top-0 h-screen bg-card/50 backdrop-blur-xl border-r border-border flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Leli Rentals" width={32} height={32} className="dark:invert" />
          {!collapsed && <span className="font-bold text-lg">Dashboard</span>}
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Quick Action - Only for Owners/Affiliates */}
      {(role === 'owner' || role === 'admin') && (
        <div className="p-4">
          <Link href="/dashboard/listings/new">
            <Button className={cn("bg-primary text-primary-foreground w-full", collapsed && "p-2")}>
              <Plus className="h-4 w-4" />
              {!collapsed && <span className="ml-2">New Listing</span>}
            </Button>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>{link.label}</span>
                  {link.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {link.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  )
}
