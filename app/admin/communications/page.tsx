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
import { sendAdminBulkCommunication } from "@/lib/actions/admin-communication-actions"

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
            <div className="flex items-center gap-4">
                <BackButton href="/admin" />
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        Admin Communication
                    </h1>
                    <p className="text-muted-foreground">Send bulk messages to users on the platform</p>
                </div>
            </div>

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
        </div>
    )
}
