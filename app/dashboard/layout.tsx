import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col h-screen w-full overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 p-3 md:p-6 gradient-mesh overflow-x-hidden overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
