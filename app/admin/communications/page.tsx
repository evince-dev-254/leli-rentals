"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Mail,
    Bell,
    MessageSquare,
    Send,
    Users,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ShieldCheck
} from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    sendAdminBulkCommunication,
    getPlatformNotifications,
    getPlatformMessages,
    deletePlatformNotification,
    deletePlatformMessage
} from "@/lib/actions/admin-communication-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Trash2 } from "lucide-react"

export default function AdminCommunicationsPage() {
    const router = useRouter()
    const [sending, setSending] = useState(false)
    const [result, setResult] = useState<any>(null)

    const [channels, setChannels] = useState({
        email: true,
        notification: true,
        message: false
    })

    const [target, setTarget] = useState<string>("all")
    const [userId, setUserId] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    // New management state
    const [platformNotifications, setPlatformNotifications] = useState<any[]>([])
    const [platformMessages, setPlatformMessages] = useState<any[]>([])
    const [loadingManagement, setLoadingManagement] = useState(false)

    const fetchManagementData = async (type: 'notifications' | 'messages') => {
        setLoadingManagement(true)
        try {
            if (type === 'notifications') {
                const res = await getPlatformNotifications()
                if (res.success) setPlatformNotifications(res.data)
            } else {
                const res = await getPlatformMessages()
                if (res.success) setPlatformMessages(res.data)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load management data")
        } finally {
            setLoadingManagement(false)
        }
    }

    const handleDeleteNotification = async (id: string) => {
        if (!confirm("Are you sure you want to delete this notification for all users?")) return
        const res = await deletePlatformNotification(id)
        if (res.success) {
            setPlatformNotifications(prev => prev.filter(n => n.id !== id))
            toast.success("Notification deleted")
        } else {
            toast.error("Failed to delete notification")
        }
    }

    const handleDeleteMessage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message? This will remove it from the users' conversation.")) return
        const res = await deletePlatformMessage(id)
        if (res.success) {
            setPlatformMessages(prev => prev.filter(m => m.id !== id))
            toast.success("Message deleted")
        } else {
            toast.error("Failed to delete message")
        }
    }

    const handleSend = async () => {
        if (!subject || !message) {
            toast.error("Please provide both a subject and a message")
            return
        }

        if (!channels.email && !channels.notification && !channels.message) {
            toast.error("Please select at least one communication channel")
            return
        }

        setSending(true)
        setResult(null)

        try {
            const res = await sendAdminBulkCommunication(
                channels,
                {
                    category: target as any,
                    userId: target === 'individual' ? userId : undefined
                } as any,
                { subject, message }
            )

            if (res.success) {
                toast.success("Bulk communication sent successfully!")
                setResult(res.data)
                // Clear form on complete success
                setSubject("")
                setMessage("")
            } else {
                toast.error(res.error || "Failed to send communication")
                setResult(res.data || { error: res.error })
            }
        } catch (e: any) {
            toast.error("An unexpected error occurred")
            console.error(e)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <BackButton href="/admin" />
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                            Communications
                        </h1>
                        <p className="text-muted-foreground">Manage platform-wide messages and notifications</p>
                    </div>
                </div>
            </div>

            <Tabs
                defaultValue="broadcast"
                className="space-y-6"
                onValueChange={(value) => {
                    if (value === 'notifications') fetchManagementData('notifications')
                    if (value === 'messages') fetchManagementData('messages')
                }}
            >
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="broadcast">
                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Form Column */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="glass-card">
                                <CardHeader>
                                    <CardTitle>Compose Message</CardTitle>
                                    <CardDescription>Compose your message and select delivery methods</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Target Audience */}
                                    <div className="space-y-3">
                                        <Label className="text-base flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Target Audience
                                        </Label>
                                        <Select value={target} onValueChange={setTarget}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select who to reach" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Broadcast to All Users</SelectItem>
                                                <SelectItem value="owners_only">Owners Only</SelectItem>
                                                <SelectItem value="renters_only">Renters Only</SelectItem>
                                                <SelectItem value="affiliates_only">Affiliates Only</SelectItem>
                                                <SelectItem value="individual">Individual User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {target === 'individual' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <Label htmlFor="userId">User ID</Label>
                                            <Input
                                                id="userId"
                                                placeholder="Enter User UUID (e.g. 550e8400-e29b-41d4-a716-446655440000)"
                                                value={userId}
                                                onChange={(e) => setUserId(e.target.value)}
                                            />
                                            <p className="text-[10px] text-muted-foreground">You can find User IDs in the User Management section.</p>
                                        </div>
                                    )}

                                    <Separator />

                                    {/* Channels */}
                                    <div className="space-y-3">
                                        <Label className="text-base">Delivery Channels</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-background/50">
                                                <Checkbox
                                                    id="email"
                                                    checked={channels.email}
                                                    onCheckedChange={(v) => setChannels(c => ({ ...c, email: !!v }))}
                                                />
                                                <label htmlFor="email" className="text-sm font-medium leading-none flex items-center gap-2 cursor-pointer">
                                                    <Mail className="h-4 w-4 text-blue-500" />
                                                    Email
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-background/50">
                                                <Checkbox
                                                    id="notification"
                                                    checked={channels.notification}
                                                    onCheckedChange={(v) => setChannels(c => ({ ...c, notification: !!v }))}
                                                />
                                                <label htmlFor="notification" className="text-sm font-medium leading-none flex items-center gap-2 cursor-pointer">
                                                    <Bell className="h-4 w-4 text-orange-500" />
                                                    Notification
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-2 p-3 rounded-lg border border-border bg-background/50">
                                                <Checkbox
                                                    id="message"
                                                    checked={channels.message}
                                                    onCheckedChange={(v) => setChannels(c => ({ ...c, message: !!v }))}
                                                />
                                                <label htmlFor="message" className="text-sm font-medium leading-none flex items-center gap-2 cursor-pointer">
                                                    <MessageSquare className="h-4 w-4 text-green-500" />
                                                    Direct Message
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject / Title</Label>
                                            <Input
                                                id="subject"
                                                placeholder="e.g. Important Update Regarding Your Account"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message-body">Message Content</Label>
                                            <Textarea
                                                id="message-body"
                                                placeholder="Write your message here..."
                                                rows={8}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-12 text-lg"
                                        disabled={sending}
                                        onClick={handleSend}
                                    >
                                        {sending ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Sending to users...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-5 w-5" />
                                                Blast Communication
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Status Column */}
                        <div className="space-y-6">
                            <Card className="glass-card bg-secondary/10 border-dashed">
                                <CardHeader>
                                    <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">
                                        Live Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!result && !sending && (
                                        <div className="text-center py-8 space-y-4">
                                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto opacity-50">
                                                <Send className="h-5 w-5" />
                                            </div>
                                            <p className="text-sm text-muted-foreground italic">
                                                Configure your blast and click send to see progress here.
                                            </p>
                                        </div>
                                    )}

                                    {sending && (
                                        <div className="space-y-4 animate-pulse">
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-1/3 animate-progress" />
                                            </div>
                                            <p className="text-sm font-medium text-center">Processing bulk communication...</p>
                                            <p className="text-xs text-muted-foreground text-center">Please do not close this window</p>
                                        </div>
                                    )}

                                    {result && (
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm">Processed</span>
                                                    <Badge variant="outline">{result.totalProcessed}</Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-green-600">
                                                    <span className="text-sm font-medium flex items-center gap-1">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Success
                                                    </span>
                                                    <span className="font-bold">{result.successCount}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-destructive">
                                                    <span className="text-sm font-medium flex items-center gap-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        Failed
                                                    </span>
                                                    <span className="font-bold">{result.failCount}</span>
                                                </div>
                                            </div>

                                            {result.errors?.length > 0 && (
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-bold uppercase text-muted-foreground">Errors</Label>
                                                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                                        {result.errors.map((err: any, idx: number) => (
                                                            <div key={idx} className="p-2 rounded bg-destructive/5 text-xs border border-destructive/10">
                                                                <p className="font-semibold text-destructive">{err.user}</p>
                                                                <ul className="list-disc pl-4 mt-1 opacity-70">
                                                                    {err.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <Button
                                                variant="outline"
                                                className="w-full text-xs"
                                                onClick={() => setResult(null)}
                                            >
                                                Clear Report
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Tips */}
                            <Card className="glass-card border-blue-500/20 bg-blue-500/5">
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-600">
                                        <AlertCircle className="h-4 w-4" />
                                        Admin Policy
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-xs text-blue-600/80 space-y-2 leading-relaxed">
                                    <p>• Avoid sending multiple blasts in a single hour to prevent spam filters.</p>
                                    <p>• Emails use the Resend service. Ensure your daily quota is not exceeded.</p>
                                    <p>• Direct messages will create a persistent conversation visible on the messaging page.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>System Notifications</CardTitle>
                            <CardDescription>All notifications sent to users on the platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mb-4"
                                onClick={() => fetchManagementData('notifications')}
                                disabled={loadingManagement}
                            >
                                Refresh Notifications
                            </Button>

                            <ScrollArea className="h-[600px] pr-4">
                                <div className="space-y-4">
                                    {platformNotifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                            <Bell className="h-12 w-12 mb-4 opacity-20" />
                                            <p>No notifications found</p>
                                            <Button variant="link" onClick={() => fetchManagementData('notifications')}>Fetch Data</Button>
                                        </div>
                                    ) : (
                                        platformNotifications.map((notif) => (
                                            <div key={notif.id} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={notif.user_profiles?.avatar_url} />
                                                            <AvatarFallback>{notif.user_profiles?.full_name?.[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-bold">{notif.user_profiles?.full_name || 'System'}</p>
                                                            <p className="text-[10px] text-muted-foreground">{notif.user_profiles?.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px]">{notif.type}</Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleDeleteNotification(notif.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{notif.title}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                    <span className="text-[10px] text-muted-foreground">{format(new Date(notif.created_at), 'PPpp')}</span>
                                                    <Badge variant={notif.is_read ? 'secondary' : 'default'} className="text-[10px]">
                                                        {notif.is_read ? 'Read' : 'Unread'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="messages">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Platform Messages</CardTitle>
                            <CardDescription>Recent direct messages between users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mb-4"
                                onClick={() => fetchManagementData('messages')}
                                disabled={loadingManagement}
                            >
                                Refresh Messages
                            </Button>

                            <ScrollArea className="h-[600px] pr-4">
                                <div className="space-y-4">
                                    {platformMessages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                                            <p>No messages found</p>
                                            <Button variant="link" onClick={() => fetchManagementData('messages')}>Fetch Data</Button>
                                        </div>
                                    ) : (
                                        platformMessages.map((msg) => (
                                            <div key={msg.id} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={msg.sender?.avatar_url} />
                                                            <AvatarFallback>{msg.sender?.full_name?.[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="truncate text-xs">
                                                            <p className="font-bold truncate">{msg.sender?.full_name}</p>
                                                            <p className="text-muted-foreground truncate italic">Sender</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-primary opacity-50">→</div>
                                                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end text-right">
                                                        <div className="truncate text-xs">
                                                            <p className="font-bold truncate">{msg.receiver?.full_name}</p>
                                                            <p className="text-muted-foreground truncate italic">Receiver</p>
                                                        </div>
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={msg.receiver?.avatar_url} />
                                                            <AvatarFallback>{msg.receiver?.full_name?.[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 ml-2"
                                                            onClick={() => handleDeleteMessage(msg.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 p-3 rounded-md text-sm border border-white/5">
                                                    {msg.content}
                                                </div>

                                                <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                                                    <span>{format(new Date(msg.created_at), 'PPpp')}</span>
                                                    {msg.conversation?.listing_id && (
                                                        <Badge variant="outline" className="text-[10px] bg-primary/10">Inquiry</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
