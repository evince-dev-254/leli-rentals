"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  CreditCard,
  DollarSign,
  ShieldCheck,
  Settings,
  LogOut,
  MessageCircle,
  Receipt,
  Star,
  Users,
  UserCog,
  Menu,
  Share2,
  Wallet,
  Bell,
  Smartphone
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { AppLoader } from "@/components/ui/app-loader"

export const allLinks = [
  { href: "/select-role?force=true", label: "Switch Account", icon: UserCog, roles: ["owner", "renter", "affiliate", "staff"], badge: "" },
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["owner", "renter", "affiliate", "staff"], badge: "" },
  { href: "/dashboard/listings", label: "My Listings", icon: Package, roles: ["owner", "renter"], badge: "" },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck, roles: ["owner", "renter"], badge: "" },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle, roles: ["owner", "renter", "affiliate"], badge: "" },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, roles: ["owner", "renter", "affiliate", "staff"], badge: "" },
  { href: "/dashboard/earnings", label: "Earnings", icon: DollarSign, roles: ["owner", "affiliate"], badge: "" },
  { href: "/dashboard/affiliate/referrals", label: "My Referees", icon: Users, roles: ["affiliate"], badge: "" },
  { href: "/dashboard/affiliate/marketing", label: "Marketing Kit", icon: Share2, roles: ["affiliate"], badge: "" },
  { href: "/dashboard/affiliate/withdrawals", label: "Withdrawals", icon: Wallet, roles: ["affiliate"], badge: "" },
  { href: "/dashboard/payments", label: "Payments", icon: Receipt, roles: ["renter"], badge: "" },
  { href: "/dashboard/reviews", label: "My Reviews", icon: Star, roles: ["renter", "owner"], badge: "" },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard, roles: ["owner"], badge: "" },
  { href: "/dashboard/verification", label: "Verification", icon: ShieldCheck, roles: ["owner"], badge: "" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["owner", "renter", "affiliate", "staff"], badge: "" },
  { href: "/dashboard/admin/mobile", label: "Mobile Manager", icon: Smartphone, roles: ["staff_only"], badge: "New" },
]

interface SidebarContentProps {
  role: string | null
  pathname: string
  onLinkClick?: () => void
}

function SidebarContent({ role, isStaff, pathname, onLinkClick }: SidebarContentProps & { isStaff?: boolean }) {
  const filteredLinks = allLinks.filter(link => {
    if (link.roles.includes("staff_only")) {
      return isStaff;
    }
    return role && link.roles.includes(role);
  })

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border/50 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onLinkClick}>
          <h2 className="text-xl font-black tracking-tight uppercase">
            {role ? (
              <>
                {role.charAt(0).toUpperCase() + role.slice(1)}<span className="text-primary ml-1">Dashboard</span>
              </>
            ) : "Loading..."}
          </h2>
        </Link>
      </div>

      {/* Quick Action - Only for Owners/Affiliates */}
      {(role === 'owner' || role === 'admin') && (
        <div className="p-4">
          <Link href="/dashboard/listings/new" onClick={onLinkClick}>
            <Button className="bg-gradient-to-tr from-primary to-purple-600 text-primary-foreground w-full rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all duration-300">
              <span className="font-semibold">New Listing</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto thin-scrollbar">
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Button
              key={link.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-secondary"
              )}
              asChild
            >
              <Link href={link.href} onClick={onLinkClick}>
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
                {link.badge && (
                  <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5 bg-primary/20 text-primary border-primary/20">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = "/"
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  )
}

function useDashboardRole() {
  const [role, setRole] = useState<string | null>(null)
  const [isStaff, setIsStaff] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('user_profiles').select('role, is_staff').eq('id', user.id).single()
        setRole(data?.role || 'renter')
        setIsStaff(data?.is_staff || false || data?.role === 'staff')
      }
      setLoading(false)
    }
    getRole()
  }, [])

  return { role, isStaff, loading }
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { role, isStaff, loading } = useDashboardRole()

  if (loading) return <div className="hidden md:block w-64 h-screen bg-card border-r border-border flex items-center justify-center">
    <AppLoader size="sm" />
  </div>

  return (
    <aside
      className="hidden md:sticky md:flex top-0 h-screen bg-card border-r border-border flex-col transition-all duration-300 w-64"
    >
      <SidebarContent role={role} isStaff={isStaff} pathname={pathname} />
    </aside>
  )
}

export function MobileDashboardSidebar() {
  const pathname = usePathname()
  const { role, isStaff } = useDashboardRole()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden shrink-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-background w-72">
        <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
        <SidebarContent role={role} isStaff={isStaff} pathname={pathname} onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
