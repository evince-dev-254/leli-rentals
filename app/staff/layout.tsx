"use client"

import { StaffSidebar, MobileStaffSidebar } from "@/components/staff/staff-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-64 shadow-xl z-10">
                <StaffSidebar className="w-full" />
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-background">
                {/* Header */}
                <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-20">
                    <MobileStaffSidebar />
                    <div className="flex-1">
                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Sales Team</span>
                            <span>/</span>
                            <span>Dashboard</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border-2 border-background" />
                        </Button>
                        <ThemeToggle />
                    </div>
                </header>

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
