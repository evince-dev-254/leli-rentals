"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { DashboardSidebar, MobileDashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Header } from "@/components/layout/header"
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-20">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col h-[calc(100vh-80px)] w-full overflow-hidden">
          <div className="md:hidden p-4 pb-2 flex items-center gap-3">
            <MobileDashboardSidebar />
            <span className="font-semibold text-lg">Menu</span>
          </div>
          <main className={cn("flex-1 p-3 md:p-6 overflow-x-hidden overflow-y-auto", gradientClass)}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
