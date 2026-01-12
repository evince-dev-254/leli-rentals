"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Users, Megaphone, Palette, Settings, UserCog, ShieldCheck, Paintbrush, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function StaffSidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const routes = [
        {
            label: "Overview",
            icon: LayoutDashboard,
            href: "/staff",
            active: pathname === "/staff",
        },
        {
            label: "Manage Affiliates",
            icon: Users,
            href: "/staff/affiliates",
            active: pathname === "/staff/affiliates",
        },
        {
            label: "Advertisers",
            icon: Megaphone,
            href: "/staff/advertisers",
            active: pathname === "/staff/advertisers",
        },
        {
            label: "Our Team",
            icon: ShieldCheck,
            href: "/staff/team",
            active: pathname === "/staff/team",
        },
        {
            label: "Brand Identity",
            icon: Paintbrush,
            href: "/staff/branding",
            active: pathname === "/staff/branding",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/staff/settings",
            active: pathname === "/staff/settings",
        },
    ]

    return (
        <div className={cn("pb-12 h-screen flex flex-col bg-card border-r", className)}>
            <div className="space-y-4 py-4 flex flex-col h-full">
                <div className="px-3 py-2">
                    <div className="flex items-center pl-2 mb-10">
                        <h2 className="text-xl font-black tracking-tight uppercase">
                            Staff<span className="text-primary ml-1">Dashboard</span>
                        </h2>
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
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function MobileStaffSidebar() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="lg:hidden p-0 w-10 h-10">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <StaffSidebar />
            </SheetContent>
        </Sheet>
    )
}
