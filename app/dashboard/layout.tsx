import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Header } from "@/components/layout/header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-20">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col h-[calc(100vh-80px)] w-full overflow-hidden">
          <main className="flex-1 p-3 md:p-6 gradient-mesh overflow-x-hidden overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
