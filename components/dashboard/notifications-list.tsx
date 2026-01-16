"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, Calendar, MessageCircle, Heart, Star, Info, AlertTriangle, ExternalLink, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AppLoader } from "@/components/ui/app-loader"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
    id: string
    title: string
    message: string
    type: string
    is_read: boolean
    created_at: string
    action_url?: string
}

export function NotificationsList() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        async function getUserId() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
                fetchNotifications(user.id)
            }
        }
        getUserId()
    }, [])

    const fetchNotifications = async (uid: string) => {
        setLoading(true)
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', uid)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setNotifications(data)
        }
        setLoading(false)
    }

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('id', id)

        if (!error) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        }
    }

    const deleteNotification = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id)

        if (!error) {
            setNotifications(prev => prev.filter(n => n.id !== id))
        }
    }

    const markAllAsRead = async () => {
        if (!userId) return
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('is_read', false)

        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'booking':
            case 'new_booking':
                return <Calendar className="h-5 w-5 text-blue-500" />
            case 'message':
            case 'new_message':
                return <MessageCircle className="h-5 w-5 text-green-500" />
            case 'favorite':
            case 'new_favorite':
                return <Heart className="h-5 w-5 text-rose-500" />
            case 'review':
            case 'new_review':
                return <Star className="h-5 w-5 text-yellow-500" />
            case 'verification':
            case 'verification_approved':
            case 'verification_rejected':
                return <Info className="h-5 w-5 text-purple-500" />
            default:
                return <Bell className="h-5 w-5 text-gray-500" />
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AppLoader size="lg" />
            <p className="text-muted-foreground animate-pulse font-medium">Loading your notifications...</p>
        </div>
    )

    return (
        <Card className="glass-card border-none shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/5 pb-6">
                <div>
                    <CardTitle className="text-2xl font-black">All Notifications</CardTitle>
                    <CardDescription>Stay updated with your latest activities</CardDescription>
                </div>
                {notifications.some(n => !n.is_read) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-primary hover:text-primary/80 hover:bg-primary/10 font-bold"
                    >
                        Mark all as read
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-0">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Bell className="h-8 w-8 text-gray-500 opacity-50" />
                        </div>
                        <div>
                            <p className="font-bold text-xl text-white">No notifications yet</p>
                            <p className="text-muted-foreground max-w-sm">When you get messages, bookings or updates, they will appear here.</p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "p-6 flex gap-4 transition-all hover:bg-white/[0.02] relative group",
                                    !notification.is_read && "bg-primary/[0.03]"
                                )}
                            >
                                <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ring-1 ring-white/10 group-hover:ring-primary/20 transition-all">
                                        {getIcon(notification.type)}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1.5 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-0.5 min-w-0">
                                            <h4 className={cn(
                                                "font-bold text-base transition-colors",
                                                !notification.is_read ? "text-white" : "text-gray-300 group-hover:text-white"
                                            )}>
                                                {notification.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notification.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full text-green-500 hover:bg-green-500/10"
                                                    onClick={() => markAsRead(notification.id)}
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a4e]">
                                                    <DropdownMenuItem
                                                        className="text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
                                                        onClick={() => deleteNotification(notification.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                        {notification.message}
                                    </p>

                                    {notification.action_url && (
                                        <Link
                                            href={notification.action_url}
                                            className="inline-flex items-center gap-2 text-sm text-primary font-bold hover:gap-3 transition-all mt-2"
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            View Details <ExternalLink className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
