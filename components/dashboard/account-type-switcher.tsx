"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
    Users,
    Building2,
    RefreshCcw,
    Loader2,
    LayoutDashboard,
    Shield,
    UserPlus,
    User
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AccountTypeSwitcher() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const getProfile = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setProfile(data)
            }
            setLoading(false)
        }
        getProfile()
    }, [])

    const handleSwitch = (path: string, label: string) => {
        router.push(path)
        toast.info(`Switched to ${label}`)
    }

    if (loading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    if (!profile) return null

    // Determine available dashboards
    const dashboards = [
        { label: 'Renter Dashboard', path: '/dashboard/renter', icon: User, color: 'text-teal-600', bg: 'bg-teal-50' },
        { label: 'Owner Dashboard', path: '/dashboard/owner', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    ]

    if (profile.role === 'affiliate') {
        dashboards.push({ label: 'Affiliate Dashboard', path: '/dashboard/affiliate', icon: UserPlus, color: 'text-pink-600', bg: 'bg-pink-50' })
    }

    // Staff Portal hidden from switcher - accessed via direct URL only


    if (profile.is_admin || profile.role === 'admin') {
        dashboards.push({ label: 'Admin Panel', path: '/admin', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full px-4 h-10 shadow-md transition-all duration-300 border-orange-500/30 hover:bg-orange-50 text-slate-800 bg-white"
                >
                    <LayoutDashboard className="h-4 w-4 text-orange-600" />
                    <span className="font-semibold whitespace-nowrap hidden sm:inline">
                        Switch Account
                    </span>
                    <RefreshCcw className="h-4 w-4 text-orange-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Dashboards</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dashboards.map((dash) => (
                    <DropdownMenuItem
                        key={dash.path}
                        onClick={() => handleSwitch(dash.path, dash.label)}
                        className="cursor-pointer gap-3 py-2"
                    >
                        <div className={cn("p-1.5 rounded-md", dash.bg)}>
                            <dash.icon className={cn("h-4 w-4", dash.color)} />
                        </div>
                        <span className="font-medium">{dash.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
