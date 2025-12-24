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
  Key,
} from "lucide-react"
import { HandHoldingKey } from "@/components/icons/hand-holding-key"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export const allLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["owner", "renter", "affiliate"] },
  { href: "/dashboard/listings", label: "My Listings", icon: Package, roles: ["owner", "renter"] }, // Renters asked for this, though strange without create
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck, roles: ["owner", "renter"] },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle, roles: ["owner", "renter"] },
  { href: "/dashboard/earnings", label: "Earnings", icon: DollarSign, roles: ["owner", "affiliate"] },
  { href: "/dashboard/affiliate/referrals", label: "My Referees", icon: Users, roles: ["affiliate"] },
  { href: "/dashboard/payments", label: "Payments", icon: Receipt, roles: ["renter"] }, // New for Renters
  { href: "/dashboard/reviews", label: "My Reviews", icon: Star, roles: ["renter"] },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard, roles: ["owner"] },
  { href: "/dashboard/verification", label: "Verification", icon: ShieldCheck, badge: "Pending", roles: ["owner"] }, // Removed for renter and affiliate
  { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["owner", "renter", "affiliate"] },
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

  if (loading) return <div className="hidden md:block w-64 h-screen bg-card/50 border-r border-border" /> // Simple skeleton

  return (
    <aside
      className={cn(
        "hidden md:sticky md:flex top-0 h-screen bg-card/50 backdrop-blur-xl border-r border-border flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo & Brand */}
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <HandHoldingKey className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-sm uppercase font-black tracking-[0.2em] text-primary">
                {role ? `${role} Dashboard` : "Loading..."}
              </span>
            </div>
          )}
        </Link>
        {!collapsed && (
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary/80 rounded-full" onClick={() => setCollapsed(true)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {collapsed && (
          <Button variant="ghost" size="icon" className="absolute -right-4 top-9 h-8 w-8 bg-card border border-border shadow-sm rounded-full z-10" onClick={() => setCollapsed(false)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Action - Only for Owners/Affiliates */}
      {(role === 'owner' || role === 'admin') && (
        <div className="p-4">
          <Link href="/dashboard/listings/new">
            <Button className={cn(
              "bg-gradient-to-tr from-primary to-purple-600 text-primary-foreground w-full rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-300",
              collapsed && "p-2 h-10 w-10 mx-auto"
            )}>
              <Plus className="h-4 w-4" />
              {!collapsed && <span className="ml-2 font-semibold">New Listing</span>}
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <link.icon className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                isActive && "scale-110"
              )} />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium">{link.label}</span>
                  {link.badge && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-primary/20 text-primary border-primary/20">
                      {link.badge}
                    </Badge>
                  )}
                </div>
              )}
              {isActive && !collapsed && (
                <div className="absolute right-0 w-1 h-5 bg-white/40 rounded-full mr-1 animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = "/"
          }}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group w-full",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
