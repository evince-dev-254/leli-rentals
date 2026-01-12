"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Moon, Sun, ShieldCheck } from "lucide-react" // Assuming you might want these actions here or just the greeting
import { Button } from "@/components/ui/button"

import { ReactNode } from "react"

interface DashboardWelcomeHeaderProps {
    user: {
        full_name?: string
        avatar_url?: string
        email?: string
    } | any
    subtitle?: string
    role?: string
    children?: ReactNode
    isVerified?: boolean
}

export function DashboardWelcomeHeader({ user, subtitle, role, children, isVerified }: DashboardWelcomeHeaderProps) {
    const [greeting, setGreeting] = useState("Good Morning")
    const [time, setTime] = useState<string>("")
    const [date, setDate] = useState<string>("")

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            const hour = now.getHours()

            if (hour < 12) setGreeting("Good Morning")
            else if (hour < 18) setGreeting("Good Afternoon")
            else setGreeting("Good Evening")

            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
            setDate(now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
        }

        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    const name = user?.user_metadata?.full_name || user?.full_name || user?.email?.split('@')[0] || "User"
    const avatar = user?.user_metadata?.avatar_url || user?.avatar_url

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-xl dark:from-background dark:to-background dark:border dark:border-border">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary blur-3xl" />
                <div className="absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-blue-500 blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-10 gap-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white/20 shadow-lg">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                            {name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            {greeting}, {name}!
                            {isVerified && (
                                <div className="bg-green-500 text-white p-1 rounded-full shadow-sm" title="Verified Owner">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                            )}
                        </h1>
                        <p className="text-blue-100 opacity-90 mt-1">
                            {subtitle || "Ready to achieve great things today?"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    {children}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-w-[200px] text-center shadow-lg hidden md:block">
                        <p className="text-xs text-blue-100 uppercase tracking-widest font-semibold mb-1">Current Time</p>
                        <p className="text-3xl font-mono font-bold tracking-wider">{time}</p>
                        <p className="text-xs text-blue-100 mt-1">{date}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
