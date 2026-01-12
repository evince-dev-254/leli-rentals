"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, Calendar, MessageCircle, Heart, Star, Info, AlertTriangle, ExternalLink } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Notification {
    id: string
    title: string
    message: string
    type: string
    is_read: boolean
    created_at: string
    action_url?: string
}

export function NotificationDropdown({ userId, unreadCount: initialCount }: { userId: string, unreadCount: number }) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(initialCount)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setUnreadCount(initialCount)
    }, [initialCount])

    const fetchNotifications = async () => {
        if (!userId) return
        setLoading(true)
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10)

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
            setUnreadCount(prev => Math.max(0, prev - 1))
        }
    }

    const markAllAsRead = async () => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('is_read', false)

        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
            setUnreadCount(0)
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'booking':
            case 'new_booking':
                return <Calendar className="h-4 w-4 text-blue-500" />
            case 'message':
            case 'new_message':
                return <MessageCircle className="h-4 w-4 text-green-500" />
            case 'favorite':
            case 'new_favorite':
                return <Heart className="h-4 w-4 text-rose-500" />
            case 'review':
            case 'new_review':
                return <Star className="h-4 w-4 text-yellow-500" />
            case 'verification':
            case 'verification_approved':
            case 'verification_rejected':
                return <Info className="h-4 w-4 text-purple-500" />
            default:
                return <Bell className="h-4 w-4 text-gray-500" />
        }
    }

    return (
        <DropdownMenu onOpenChange={(open) => open && fetchNotifications()}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-200 hover:text-orange-400 hover:bg-white/10 relative"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-[#1a1a2e]">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[320px] sm:w-[380px] bg-[#1a1a2e] border-[#2a2a4e] text-gray-200 p-0 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <DropdownMenuLabel className="p-0 font-bold text-white">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="h-auto p-0 text-xs text-orange-400 hover:text-orange-300 hover:bg-transparent"
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <div className="h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-gray-400">Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                <Bell className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm">All caught up!</p>
                                <p className="text-xs text-gray-400">No new notifications at the moment.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="py-1">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "px-4 py-3 flex gap-3 transition-colors relative group",
                                        !notification.is_read ? "bg-white/5" : "hover:bg-white/[0.02]"
                                    )}
                                >
                                    <div className="shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                            {getIcon(notification.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-1 overflow-hidden">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={cn("text-sm font-semibold truncate", !notification.is_read ? "text-white" : "text-gray-300")}>
                                                {notification.title}
                                            </p>
                                            <span className="text-[10px] text-gray-500 shrink-0">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                            {notification.message}
                                        </p>

                                        {notification.action_url && (
                                            <Link
                                                href={notification.action_url}
                                                className="inline-flex items-center gap-1 text-[11px] text-orange-400 font-medium hover:text-orange-300 mt-1"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                View details <ExternalLink className="h-2.5 w-2.5" />
                                            </Link>
                                        )}
                                    </div>

                                    {!notification.is_read && (
                                        <button
                                            onClick={() => markAsRead(notification.id)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Mark as read"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <DropdownMenuSeparator className="bg-white/10 m-0" />
                <div className="p-2">
                    <Button asChild variant="ghost" className="w-full text-center text-xs text-gray-400 hover:text-white hover:bg-white/5 h-9 rounded-lg">
                        <Link href="/dashboard?tab=notifications">View all notifications</Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
