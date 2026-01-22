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
    LayoutDashboard
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
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        liveUsers: 0,
        totalMobile: 0,
        versionData: [] as any[],
        platformData: [] as any[]
    })

    useEffect(() => {
        const fetchMobileData = async () => {
            setLoading(true)
            try {
                // Fetch users who have ever touched the mobile app (have last_app_version)
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('id, full_name, email, last_active_at, last_app_version, ota_update_id, device_platform, avatar_url')
                    .not('last_app_version', 'is', null)
                    .order('last_active_at', { ascending: false })

                if (error) throw error

                if (data) {
                    setUsers(data)

                    // Calculate stats
                    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000)
                    const live = data.filter(u => u.last_active_at && new Date(u.last_active_at) > fifteenMinsAgo).length

                    // Version breakdown
                    const versions = data.reduce((acc: any, u) => {
                        const v = u.last_app_version || 'unknown'
                        acc[v] = (acc[v] || 0) + 1
                        return acc
                    }, {})
                    const versionChartData = Object.entries(versions).map(([name, value]) => ({ name, value }))

                    // Platform breakdown
                    const platforms = data.reduce((acc: any, u) => {
                        const p = u.device_platform || 'unknown'
                        acc[p] = (acc[p] || 0) + 1
                        return acc
                    }, {})
                    const platformChartData = Object.entries(platforms).map(([name, value]) => ({ name, value }))

                    setStats({
                        liveUsers: live,
                        totalMobile: data.length,
                        versionData: versionChartData,
                        platformData: platformChartData
                    })
                }
            } catch (err) {
                console.error('Error fetching mobile ops data:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchMobileData()

        // Subscription for real-time updates
        const channel = supabase
            .channel('mobile-tracking')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_profiles' }, payload => {
                if (payload.new.last_app_version) {
                    fetchMobileData()
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
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
                        <div className="bg-blue-600 p-2 rounded-xl text-white">
                            <Smartphone size={24} />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mobile Operations</h1>
                    </div>
                    <p className="text-slate-500 mt-1 font-medium">Real-time control center for the Leli Rentals mobile ecosystem.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-4 py-2 rounded-full border-blue-200 bg-blue-50 text-blue-700 font-bold">
                        <Activity size={14} className="mr-2 animate-pulse" />
                        {stats.liveUsers} Users Online
                    </Badge>
                    <Button variant="outline" className="rounded-full h-10 w-10 p-0" onClick={() => window.location.reload()}>
                        <RefreshCw size={18} />
                    </Button>
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: 'Total Registered', value: stats.totalMobile, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { title: 'Current Version', value: 'v1.0.2', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { title: 'OTA Status', value: 'Healthy', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { title: 'Health Score', value: '98%', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' }
                ].map((stat, i) => (
                    <Card key={i} className="border-slate-100 shadow-sm rounded-[24px] hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                            <p className="text-xs text-slate-500 font-bold mt-1 uppercase">{stat.title}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Real-time Charts Section */}
                <Card className="lg:col-span-2 border-slate-100 shadow-sm rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl font-black flex items-center">
                                    <History size={20} className="mr-2 text-blue-600" />
                                    Version Distribution
                                </CardTitle>
                                <CardDescription>Tracking app builds across the active user base.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.versionData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                    {stats.versionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recently Active Users Feed */}
                <Card className="border-slate-100 shadow-sm rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-xl font-black flex items-center">
                            <Activity size={20} className="mr-2 text-emerald-600" />
                            Live Activity
                        </CardTitle>
                        <CardDescription>Recent mobile session heartbeats.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="max-h-[400px] overflow-y-auto">
                            {users.slice(0, 10).map((user, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 items-center justify-center font-bold text-slate-500 overflow-hidden ring-2 ring-white">
                                        {user.avatar_url ? (
                                            <img src={`https://tdtjevpnqrwqcjnuywrn.supabase.co/storage/v1/object/public/avatars/${user.avatar_url}`} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            user.full_name?.[0] || '?'
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className="text-sm font-bold text-slate-900 truncate">{user.full_name || 'Anonymous User'}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-[10px] px-1.5 h-4 rounded-md">v{user.last_app_version}</Badge>
                                            <span className="text-[10px] text-slate-400 capitalize">{user.device_platform || 'unknown'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-900">{user.last_active_at ? formatDistanceToNow(new Date(user.last_active_at), { addSuffix: true }) : 'N/A'}</p>
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 ml-auto mt-1" />
                                    </div>
                                </div>
                            ))}
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
