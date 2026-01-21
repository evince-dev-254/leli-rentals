"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Bell, Smartphone, Send, Users, Activity, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const notificationSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    message: z.string().min(5, { message: "Message must be at least 5 characters." }),
    type: z.enum(["info", "success", "warning", "error"]),
    target_user_id: z.string().optional(), // If empty, could mean broadcast (requires logic update)
})

export default function MobileManagerPage() {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof notificationSchema>>({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            title: "",
            message: "",
            type: "info",
            target_user_id: "",
        },
    })

    async function onSubmit(values: z.infer<typeof notificationSchema>) {
        setLoading(true)
        try {
            // Logic for Broadcast vs Single User
            // If target_user_id is provided, send to that user.
            // If NOT provided, we might want to send to ALL users (dangerous, so distinct logic needed).
            // For now, let's enforce single user for safety or iterate if we implement broadcast.

            if (!values.target_user_id) {
                toast.error("Global broadcast is disabled for safety. Please specify a User ID.")
                setLoading(false)
                return
            }

            const { error } = await supabase.from("notifications").insert({
                user_id: values.target_user_id,
                title: values.title,
                message: values.message,
                type: values.type,
                is_read: false
            })

            if (error) throw error

            toast.success("Notification dispatched successfully!")
            form.reset()
        } catch (error: any) {
            toast.error("Failed to send notification: " + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mobile App Manager</h1>
                    <p className="text-muted-foreground">Manage notifications, versioning, and mobile operational status.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/** Dispatch Card */}
                <Card className="col-span-1 border-t-4 border-t-blue-500 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-blue-500" />
                            Dispatch Center
                        </CardTitle>
                        <CardDescription>Send push/in-app notifications to mobile users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. System Maintenance" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message Content</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Type your alert here..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="info">Info (Blue)</SelectItem>
                                                        <SelectItem value="success">Success (Green)</SelectItem>
                                                        <SelectItem value="warning">Warning (Yellow)</SelectItem>
                                                        <SelectItem value="error">Error (Red)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="target_user_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Target User ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="UUID..." {...field} />
                                                </FormControl>
                                                <FormDescription className="text-xs">Leave empty for broadcast (Disabled)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                                    {loading ? "Sending..." : "Dispatch Message"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/** Stats / Status */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-green-500" />
                                Live Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                    <Smartphone className="h-4 w-4" />
                                    Active Installs
                                </div>
                                <div className="text-2xl font-bold">1,248</div>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    App Version
                                </div>
                                <div className="text-2xl font-bold">v1.0.1</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-purple-500" />
                                Beta Testers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                Manage TestFlight and Slot access via the Developer Console.
                            </div>
                            <Button variant="outline" className="w-full mt-4" onClick={() => window.open('https://appstoreconnect.apple.com', '_blank')}>
                                Open App Store Connect
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
