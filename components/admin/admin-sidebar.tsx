"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  CalendarCheck,
  UserPlus,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Key,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/verifications", label: "Verifications", icon: ShieldCheck },
  { href: "/admin/listings", label: "Listings", icon: Package },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/affiliates", label: "Affiliates", icon: UserPlus },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 h-screen bg-card/50 backdrop-blur-xl border-r border-border flex flex-col transition-all duration-300 w-64">
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <span className="font-black text-lg tracking-wide uppercase bg-gradient-to-r from-purple-500 via-pink-500 to-primary bg-clip-text text-transparent hover:from-purple-500/80 hover:via-pink-500/80 hover:to-primary/80 transition-all duration-300">Admin Portal</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarLinks.map((link) => {
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
              <span>{link.label}</span>
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
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  )
}
