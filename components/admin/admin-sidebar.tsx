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
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen bg-card/50 backdrop-blur-xl border-r border-border flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Key className="h-6 w-6 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-lg text-primary tracking-tight">Admin Portal</span>}
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
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
              <link.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
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
          {!collapsed && <span>Exit Admin</span>}
        </Link>
      </div>
    </aside>
  )
}
