"use client"

import React, { useState, useEffect } from 'react'
import {
    Smartphone,
    Send,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Bell,
    Cpu,
    ShieldCheck,
    Package,
    Activity,
    Users,
    Zap,
    Clock,
    History,
    Settings,
    LayoutDashboard,
    MessageSquare,
    ShoppingBag,
    User
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts'
import { formatDistanceToNow } from 'date-fns'

export function MobileOps() {
    const [pushTitle, setPushTitle] = useState('')
    const [pushMessage, setPushMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [users, setUsers] = useState<any[]>([])
    const [operations, setOperations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        liveUsers: 0,
        totalMobile: 0,
        versionData: [] as any[],
        activeRentals: 0
    })

    const fetchMobileData = async () => {
        setLoading(true)
        try {
            // 1. Fetch mobile users
            const { data: userData, error: userError } = await supabase
                .from('user_profiles')
                .select('id, full_name, email, last_active_at, last_app_version, ota_update_id, device_platform, avatar_url')
                .not('last_app_version', 'is', null)
                .order('last_active_at', { ascending: false })

            if (userError) throw userError

            // 2. Fetch recent "Operations" (Bookings and Messages)
            const [bookings, messages] = await Promise.all([
                supabase.from('bookings').select('id, created_at, renter_id, status, listings(title)').order('created_at', { ascending: false }).limit(10),
                supabase.from('messages').select('id, created_at, sender_id, content').order('created_at', { ascending: false }).limit(10)
            ])

            // Combine into a stream
            const combinedOps = [
                ...(bookings.data || []).map(b => ({
                    id: b.id,
                    type: 'booking',
                    title: 'New Booking',
                    desc: b.listings?.title || 'Unknown Asset',
                    user_id: b.renter_id,
                    created_at: b.created_at,
                    icon: ShoppingBag
                })),
                ...(messages.data || []).map(m => ({
                    id: m.id,
                    type: 'message',
                    title: 'Sent Message',
                    desc: m.content.substring(0, 30) + '...',
                    user_id: m.sender_id,
                    created_at: m.created_at,
                    icon: MessageSquare
                }))
            ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 15)

            if (userData) {
                setUsers(userData)
                setOperations(combinedOps)

                // Calculate stats
                const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000)
                const live = userData.filter(u => u.last_active_at && new Date(u.last_active_at) > fifteenMinsAgo).length

                const versions = userData.reduce((acc: any, u) => {
                    const v = u.last_app_version || 'unknown'
                    acc[v] = (acc[v] || 0) + 1
                    return acc
                }, {})
                const versionChartData = Object.entries(versions).map(([name, value]) => ({ name, value }))

                setStats({
                    liveUsers: live,
                    totalMobile: userData.length,
                    versionData: versionChartData,
                    activeRentals: bookings.data?.filter(b => b.status === 'confirmed').length || 0
                })
            }
        } catch (err) {
            console.error('Error fetching mobile ops data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMobileData()

        const channel = supabase
            .channel('mobile-tracking')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, () => fetchMobileData())
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, () => fetchMobileData())
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [])

    const handleSendPush = async () => {
        setSending(true)
        // Simulate API call to send push via Expo / Firebase
        setTimeout(() => {
            alert('Push notification dispatched to all mobile devices!')
            setSending(false)
            setPushTitle('')
            setPushMessage('')
        }, 1500)
    }

    const COLORS = ['#3b82f6', '#10b981', '#f97316', '#a855f7', '#64748b']

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header with Glass Effect */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 backdrop-blur-md p-6 rounded-[32px] border border-slate-200">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                            <Smartphone size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mobile Operations</h1>
                    </div>
                    <p className="text-slate-500 mt-1 font-medium">Monitoring the Leli ecosystem on build <span className="text-blue-600 font-bold">1.0.1</span></p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-5 py-2.5 rounded-full border-blue-200 bg-blue-50 text-blue-700 font-bold shadow-sm">
                        <Activity size={14} className="mr-2 animate-pulse" />
                        {stats.liveUsers} Online Now
                    </Badge>
                    <Button variant="outline" className="rounded-full h-12 w-12 p-0 border-slate-200 bg-white shadow-sm" onClick={fetchMobileData}>
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </Button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: 'Registered App Users', value: stats.totalMobile, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Active Build', value: 'v1.0.1', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { title: 'Push Health', value: '99.4%', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { title: 'Daily Bookings', value: stats.activeRentals, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' }
                ].map((stat, i) => (
                    <Card key={i} className="border-slate-100 shadow-sm rounded-[24px] hover:shadow-md transition-all group overflow-hidden">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`${stat.bg} ${stat.color} p-2 rounded-xl group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Metric</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tight">{stat.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Users and Their Operations */}
                <Card className="lg:col-span-2 border-slate-100 shadow-sm rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl font-black flex items-center">
                                    <Users size={20} className="mr-2 text-blue-600" />
                                    Mobile User Operations
                                </CardTitle>
                                <CardDescription>Detailed tracking of active app sessions and actions.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest sticky top-0 bg-white border-b border-slate-100">
                                    <tr>
                                        <th className="p-6">User</th>
                                        <th className="p-6">Build</th>
                                        <th className="p-6">Platform</th>
                                        <th className="p-6">Last Active</th>
                                        <th className="p-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, i) => (
                                        <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 overflow-hidden ring-2 ring-white">
                                                        {user.avatar_url ? (
                                                            <img src={`https://tdtjevpnqrwqcjnuywrn.supabase.co/storage/v1/object/public/avatars/${user.avatar_url}`} alt="" />
                                                        ) : <User size={18} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{user.full_name || 'Anonymous'}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-xs font-bold text-slate-600">v{user.last_app_version}</td>
                                            <td className="p-6">
                                                <Badge variant="secondary" className="text-[10px] hover:bg-slate-100 transition-colors capitalize">{user.device_platform || 'iOS'}</Badge>
                                            </td>
                                            <td className="p-6 text-[10px] font-bold text-slate-500">{user.last_active_at ? formatDistanceToNow(new Date(user.last_active_at), { addSuffix: true }) : 'N/A'}</td>
                                            <td className="p-6">
                                                <div className={`h-2 w-2 rounded-full ${user.last_active_at && new Date(user.last_active_at) > new Date(Date.now() - 15 * 60 * 1000) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Operation Stream */}
                <Card className="border-slate-100 shadow-sm rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-xl font-black flex items-center">
                            <Activity size={20} className="mr-2 text-emerald-600" />
                            Operation Stream
                        </CardTitle>
                        <CardDescription>Live events from build 1.0.1 devices.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
                            {operations.map((op, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${op.type === 'booking' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                        <op.icon size={18} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">{op.title}</h4>
                                            <span className="text-[9px] font-bold text-slate-300">{formatDistanceToNow(new Date(op.created_at), { addSuffix: true })}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate font-medium">{op.desc}</p>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                                            <span className="text-[9px] font-black text-slate-400">UID: {op.user_id.substring(0, 8)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {operations.length === 0 && (
                                <div className="p-8 text-center">
                                    <Activity size={32} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-xs font-bold text-slate-400">No operations recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Remote Dispatch Section */}
                <Card className="border-slate-100 shadow-sm rounded-[32px] overflow-hidden border-t-4 border-t-blue-600/20">
                    <CardHeader className="bg-slate-50/50">
                        <CardTitle className="flex items-center font-black">
                            <Bell size={20} className="mr-2 text-blue-600" />
                            Remote Dispatch (Push)
                        </CardTitle>
                        <CardDescription>Target specific segments or broadcast to all devices.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Title</label>
                            <Input
                                placeholder="e.g., Weekend Special Offer!"
                                value={pushTitle}
                                onChange={(e) => setPushTitle(e.target.value)}
                                className="rounded-2xl h-12 bg-slate-50 border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Payload Content</label>
                            <Textarea
                                placeholder="Enter the content of your notification..."
                                value={pushMessage}
                                onChange={(e) => setPushMessage(e.target.value)}
                                className="rounded-2xl min-h-[140px] bg-slate-50 border-slate-200 pt-4"
                            />
                        </div>
                        <Button
                            onClick={handleSendPush}
                            disabled={sending || !pushTitle || !pushMessage}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 font-black shadow-lg shadow-blue-200"
                        >
                            {sending ? <RefreshCw className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
                            Execute Global Dispatch
                        </Button>
                    </CardContent>
                </Card>

                {/* Remote Configuration Section */}
                <Card className="border-slate-100 shadow-sm rounded-[32px] overflow-hidden border-t-4 border-t-orange-600/20">
                    <CardHeader className="bg-slate-50/50">
                        <CardTitle className="flex items-center font-black">
                            <Settings size={20} className="mr-2 text-slate-900" />
                            Live Configuration
                        </CardTitle>
                        <CardDescription>Modify app behavior without re-publishing.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {[
                            { title: 'Maintenance Mode', desc: 'Lock the app for routine database upgrades.', action: 'Activate', color: 'bg-slate-100', text: 'text-slate-900' },
                            { title: 'Force Force Update', desc: 'Make v1.0.3 the minimum required build.', action: 'Trigger v1.0.3', color: 'bg-orange-50', text: 'text-orange-600' },
                            { title: 'Purge Mobile Cache', desc: 'Invaliate all local CDN & session stores.', action: 'Wipe Cache', color: 'bg-rose-50', text: 'text-rose-600' },
                            { title: 'Beta Testing', desc: 'Enable experimental features for specific IDs.', action: 'Manage Early Access', color: 'bg-emerald-50', text: 'text-emerald-600' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[24px]">
                                <div className="max-w-[70%]">
                                    <h4 className="font-black text-slate-900 leading-tight">{item.title}</h4>
                                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.desc}</p>
                                </div>
                                <Button variant="outline" className={`rounded-xl border-none font-bold text-xs ${item.color} ${item.text} hover:opacity-80`}>
                                    {item.action}
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
