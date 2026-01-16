"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  CalendarCheck,
  UserPlus,
  Settings,
  LogOut,
  MessageSquare,
  Send,
  Key,
  UserCog,
  Menu,
  CreditCard,
  Smartphone
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  // Function to handle sign out - simplified for now, can be expanded
  const handleSignOut = () => {
    window.location.href = "/"
  }

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Platform Users",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      label: "Staff Management",
      icon: UserCog,
      href: "/admin/staff",
      active: pathname === "/admin/staff",
    },
    {
      label: "Manage Admins",
      icon: Key,
      href: "/admin/admins",
      active: pathname.startsWith("/admin/admins"),
    },
    {
      label: "Verifications",
      icon: ShieldCheck,
      href: "/admin/verifications",
      active: pathname === "/admin/verifications",
    },
    {
      label: "Listings",
      icon: Package,
      href: "/admin/listings",
      active: pathname === "/admin/listings",
    },
    {
      label: "Bookings",
      icon: CalendarCheck,
      href: "/admin/bookings",
      active: pathname === "/admin/bookings",
    },
    {
      label: "Payments & Subscriptions",
      icon: CreditCard,
      href: "/admin/subscriptions",
      active: pathname.startsWith("/admin/subscriptions") || pathname.startsWith("/admin/payments"),
    },
    {
      label: "Affiliates",
      icon: UserPlus,
      href: "/admin/affiliates",
      active: pathname === "/admin/affiliates",
    },
    {
      label: "Communications",
      icon: Send,
      href: "/admin/communications",
      active: pathname === "/admin/communications",
    },
    {
      label: "Reviews",
      icon: MessageSquare,
      href: "/admin/reviews",
      active: pathname === "/admin/reviews",
    },
    {
      label: "Paystack Settings",
      icon: Settings,
      href: "/admin/paystack-settings",
      active: pathname === "/admin/paystack-settings",
    },
    {
      label: "Mobile Operations",
      icon: Smartphone,
      href: "/admin/mobile",
      active: pathname === "/admin/mobile",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
    {
      label: "Test Payment",
      icon: CreditCard,
      href: "/admin/test-payment",
      active: pathname === "/admin/test-payment",
    },
  ]

  return (
    <div className={cn("pb-12 h-screen flex flex-col bg-card border-r", className)}>
      <div className="space-y-4 py-4 flex flex-col h-full">
        <div className="px-3 py-2">
          <div className="flex items-center pl-2 mb-10">
            <Link href="/admin">
              <h2 className="text-xl font-black tracking-tight uppercase">
                Admin<span className="text-primary ml-1">Dashboard</span>
              </h2>
            </Link>
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  route.active && "bg-secondary"
                )}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-auto px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Exit Admin
          </Button>
        </div>
      </div>
    </div>
  )
}

export function MobileAdminSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <AdminSidebar />
      </SheetContent>
    </Sheet>
  )
}
