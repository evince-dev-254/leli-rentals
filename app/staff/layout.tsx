"use client"

import { StaffSidebar, MobileStaffSidebar } from "@/components/staff/staff-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Header } from "@/components/layout/header"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { AppLoader } from "@/components/ui/app-loader"

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [verifying, setVerifying] = useState(true)

    useEffect(() => {
        const checkRole = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.replace('/login')
                return
            }

            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (!profile || profile.role !== 'staff') {
                router.replace('/dashboard')
                return
            }
            setVerifying(false)
        }
        checkRole()
    }, [router])

    if (verifying) return <div className="min-h-screen flex items-center justify-center bg-background"><AppLoader size="lg" /></div>

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1 pt-20 lg:pt-24">
                {/* Desktop Sidebar */}
                <div className="hidden lg:flex w-64 shadow-xl z-10">
                    <StaffSidebar className="w-full" />
                </div>

                <div className="flex-1 flex flex-col min-w-0 bg-background">
                    {/* Header */}
                    <DashboardHeader
                        mobileSidebar={<MobileStaffSidebar />}
                        breadcrumbs={[
                            { label: "Leli Rentals", href: "/staff" },
                            { label: "Staff Dashboard" }
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
        </div>
    )
}
