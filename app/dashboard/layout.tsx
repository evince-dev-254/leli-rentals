"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { DashboardSidebar, MobileDashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Header } from "@/components/layout/header"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const getUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserRole(user.user_metadata?.role || 'renter')
      }
    }
    getUserRole()
  }, [])

  let gradientClass = "gradient-mesh"
  if (pathname?.includes('/admin')) {
    gradientClass = "gradient-mesh-admin"
  } else if (pathname?.includes('/affiliate')) {
    gradientClass = "gradient-mesh-affiliate"
  } else if (pathname?.includes('/renter')) {
    gradientClass = "gradient-mesh-renter"
  }

  // Determine dashboard title from path
  let dashboardTitle = "Dashboard"
  if (pathname?.includes('/dashboard/owner')) {
    dashboardTitle = "Owner Dashboard"
  } else if (pathname?.includes('/dashboard/affiliate')) {
    dashboardTitle = "Affiliate Dashboard"
  } else if (pathname?.includes('/dashboard/renter')) {
    dashboardTitle = "Renter Dashboard"
  } else if (pathname?.includes('/admin')) {
    dashboardTitle = "Admin Dashboard"
  } else if (userRole) {
    // Fallback to user role if at root /dashboard
    dashboardTitle = `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard`
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 pt-24 lg:pt-28">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 shadow-xl z-10">
          <DashboardSidebar />
        </div>

        <div className={cn(
          "flex-1 flex flex-col min-w-0 bg-background",
          pathname?.includes('/messages') ? "h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)]" : ""
        )}>
          {/* Header */}
          {!pathname?.includes('/messages') && (
            <DashboardHeader
              mobileSidebar={<MobileDashboardSidebar />}
              breadcrumbs={[{
                label: dashboardTitle
              }]}
            />
          )}

          {/* Main Content */}
          <main className={cn(
            "flex-1 relative",
            pathname?.includes('/messages') ? "h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)] overflow-hidden" : "p-4 lg:p-8 overflow-y-auto",
            gradientClass
          )}>
            <div className={cn(
              "mx-auto animate-in fade-in duration-500 h-full flex flex-col",
              pathname?.includes('/messages') ? "w-full max-w-none" : "max-w-7xl"
            )}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
