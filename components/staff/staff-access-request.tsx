"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Clock, Send, AlertCircle } from "lucide-react"
import { requestStaffAccess } from "@/lib/actions/staff-actions"
import { toast } from "sonner"
import { LoadingLogo } from "@/components/ui/loading-logo"

interface StaffAccessRequestProps {
    userId: string
    status: "none" | "pending"
    onSuccess?: () => void
}

export function StaffAccessRequest({ userId, status: initialStatus, onSuccess }: StaffAccessRequestProps) {
    const [status, setStatus] = useState(initialStatus)
    const [loading, setLoading] = useState(false)

    const handleRequest = async () => {
        setLoading(true)
        try {
            const result = await requestStaffAccess(userId)
            if (result.success) {
                setStatus("pending")
                toast.success("Request submitted successfully")
                onSuccess?.()
            } else {
                toast.error(result.error || "Failed to submit request")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    if (status === "pending") {
        return (
            <Card className="max-w-md mx-auto glass-card">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-orange-100 dark:bg-orange-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle className="text-2xl">Approval Pending</CardTitle>
                    <CardDescription>
                        Your request for staff access is being reviewed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        Our administrators have been notified. You will gain access as soon as your request is approved.
                    </p>
                    <div className="p-3 bg-muted rounded-lg text-sm flex gap-3 text-left">
                        <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                        <p>Typically, requests are reviewed within 24 hours.</p>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                        <a href="/dashboard">Back to Dashboard</a>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-md mx-auto glass-card border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-primary">
                    <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">Staff Portal Access</CardTitle>
                <CardDescription>
                    Request access to the Leli Rentals Staff Dashboard
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <div className="space-y-4">
                    <div className="flex gap-4 items-start text-left">
                        <div className="mt-1 bg-primary/20 p-1 rounded-full"><Send className="h-3 w-3 text-primary" /></div>
                        <div>
                            <p className="font-semibold text-sm">Join the Team</p>
                            <p className="text-xs text-muted-foreground">Manage affiliates, advertisers and team performance.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start text-left">
                        <div className="mt-1 bg-primary/20 p-1 rounded-full"><Send className="h-3 w-3 text-primary" /></div>
                        <div>
                            <p className="font-semibold text-sm">Sales Tools</p>
                            <p className="text-xs text-muted-foreground">Access exclusive branding resources and sales tracking.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    {loading ? (
                        <div className="flex justify-center"><LoadingLogo size={40} /></div>
                    ) : (
                        <Button onClick={handleRequest} className="w-full bg-primary text-primary-foreground h-12 text-lg">
                            Request Access
                        </Button>
                    )}
                </div>
                <Button variant="ghost" size="sm" asChild>
                    <a href="/dashboard">Maybe later</a>
                </Button>
            </CardContent>
        </Card>
    )
}
