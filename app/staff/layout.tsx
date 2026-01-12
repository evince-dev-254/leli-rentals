"use client"

import { StaffSidebar, MobileStaffSidebar } from "@/components/staff/staff-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-64 shadow-xl z-10">
                <StaffSidebar className="w-full" />
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-background">
                {/* Header */}
                <DashboardHeader
                    mobileSidebar={<MobileStaffSidebar />}
                    breadcrumbs={[
                        { label: "Sales Team", href: "/staff" },
                        { label: "Dashboard" }
                    ]}
                />

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
