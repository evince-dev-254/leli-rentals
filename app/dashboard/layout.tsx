"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { DashboardSidebar, MobileDashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  let gradientClass = "gradient-mesh"
  if (pathname?.includes('/admin')) {
    gradientClass = "gradient-mesh-admin"
  } else if (pathname?.includes('/affiliate')) {
    gradientClass = "gradient-mesh-affiliate"
  } else if (pathname?.includes('/renter')) {
    gradientClass = "gradient-mesh-renter"
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 shadow-xl z-10">
        <DashboardSidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {/* Header */}
        <DashboardHeader
          mobileSidebar={<MobileDashboardSidebar />}
          breadcrumbs={[
            { label: "My Account", href: "/dashboard" },
            { label: "Dashboard" }
          ]}
        />

        {/* Main Content */}
        <main className={cn("flex-1 p-4 lg:p-8 overflow-y-auto", gradientClass)}>
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
