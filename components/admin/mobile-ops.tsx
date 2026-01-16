"use client"

import React, { useState } from 'react'
import {
    Smartphone,
    Send,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Bell,
    Cpu,
    ShieldCheck,
    Package
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export function MobileOps() {
    const [pushTitle, setPushTitle] = useState('')
    const [pushMessage, setPushMessage] = useState('')
    const [sending, setSending] = useState(false)

    const handleSendPush = async () => {
        setSending(true)
        // Simulate API call to send push
        setTimeout(() => {
            alert('Push notification dispatched to all mobile devices!')
            setSending(false)
            setPushTitle('')
            setPushMessage('')
        }, 1500)
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Mobile Operations</h1>
                    <p className="text-slate-500 mt-1">Oversee mobile app health and manage remote dispatch.</p>
                </div>
                <Badge variant="outline" className="px-4 py-1 rounded-full border-blue-200 bg-blue-50 text-blue-700">
                    <Smartphone size={14} className="mr-2" />
                    App Version: 1.0.1 (Stable)
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-100 shadow-sm rounded-[24px]">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Cpu size={18} className="mr-2 text-blue-600" />
                            App Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">API Status</span>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">Optimal</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Push Delivery</span>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">98.2%</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Session Drift</span>
                                <span className="text-sm font-bold">12ms</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm rounded-[24px]">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <ShieldCheck size={18} className="mr-2 text-purple-600" />
                            Auth Pulse
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Active Mobile Users</span>
                                <span className="text-sm font-bold">4.2k</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Token Refreshes (24h)</span>
                                <span className="text-sm font-bold">12.4k</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Biometric Use</span>
                                <span className="text-sm font-bold">64%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm rounded-[24px]">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <Package size={18} className="mr-2 text-orange-600" />
                            Inventory Sync
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Mobile Page Views</span>
                                <span className="text-sm font-bold">82.1k</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500">Booking Pipeline</span>
                                <span className="text-sm font-bold text-blue-600 font-mono">Synced</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-slate-100 shadow-sm rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-slate-50/50">
                        <CardTitle className="flex items-center">
                            <Bell size={20} className="mr-2 text-blue-600" />
                            Remote Dispatch (Push)
                        </CardTitle>
                        <CardDescription>Send instant notifications to all mobile users.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Notification Title</label>
                            <Input
                                placeholder="e.g., Weekend Special Offer!"
                                value={pushTitle}
                                onChange={(e) => setPushTitle(e.target.value)}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message Payload</label>
                            <Textarea
                                placeholder="Enter the content of your notification..."
                                value={pushMessage}
                                onChange={(e) => setPushMessage(e.target.value)}
                                className="rounded-xl min-h-[120px]"
                            />
                        </div>
                        <Button
                            onClick={handleSendPush}
                            disabled={sending || !pushTitle || !pushMessage}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-black"
                        >
                            {sending ? <RefreshCw className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
                            Dispatch Notification
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-slate-100 shadow-sm rounded-[32px] overflow-hidden">
                    <CardHeader className="bg-slate-50/50">
                        <CardTitle className="flex items-center">
                            <Smartphone size={20} className="mr-2 text-slate-600" />
                            App Configuration
                        </CardTitle>
                        <CardDescription>Manage remote settings and maintenance modes.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div>
                                <h4 className="font-bold text-slate-900">Maintenance Mode</h4>
                                <p className="text-xs text-slate-500">Disable all mobile operations temporarily.</p>
                            </div>
                            <Button variant="outline" className="rounded-xl">Activate</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div>
                                <h4 className="font-bold text-slate-900">Force Update</h4>
                                <p className="text-xs text-slate-500">Require all users to update to latest build.</p>
                            </div>
                            <Button variant="outline" className="rounded-xl border-orange-200 text-orange-600 bg-orange-50">Trigger Update</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div>
                                <h4 className="font-bold text-slate-900">Clear Cache</h4>
                                <p className="text-xs text-slate-500">Force clear client-side inventory cache.</p>
                            </div>
                            <Button variant="outline" className="rounded-xl">Wipe Cache</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
