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
  Send,
  Key,
  UserCog,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Platform Users", icon: Users },
  { href: "/admin/staff", label: "Staff Management", icon: UserCog },
  { href: "/admin/admins", label: "Manage Admins", icon: Key },
  { href: "/admin/verifications", label: "Verifications", icon: ShieldCheck },
  { href: "/admin/listings", label: "Listings", icon: Package },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/affiliates", label: "Affiliates", icon: UserPlus },
  { href: "/admin/communications", label: "Communications", icon: Send },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

interface AdminSidebarContentProps {
  pathname: string
  onLinkClick?: () => void
}

function AdminSidebarContent({ pathname, onLinkClick }: AdminSidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group" onClick={onLinkClick}>
          <span className="font-black text-lg tracking-wide uppercase bg-gradient-to-r from-purple-500 via-pink-500 to-primary bg-clip-text text-transparent hover:from-purple-500/80 hover:via-pink-500/80 hover:to-primary/80 transition-all duration-300">Admin Portal</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all",
          )}
        >
          <LogOut className="h-5 w-5" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex sticky top-0 h-screen bg-card/50 backdrop-blur-xl border-r border-border flex-col transition-all duration-300 w-64">
      <AdminSidebarContent pathname={pathname} />
    </aside>
  )
}

export function MobileAdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden shrink-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-background/95 backdrop-blur-xl border-r border-border w-72">
        <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
        <AdminSidebarContent pathname={pathname} onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
