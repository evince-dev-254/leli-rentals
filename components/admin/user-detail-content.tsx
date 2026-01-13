"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Shield,
    ShieldOff,
    Ban,
    CheckCircle,
    Trash2,
    Users,
    CreditCard,
    ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { updateProfile } from "@/lib/actions/dashboard-actions"
import { suspendUsers, reactivateUsers, deleteUsers } from "@/lib/actions/admin-actions"

interface UserDetailContentProps {
    user: any
}

export function UserDetailContent({ user: initialUser }: UserDetailContentProps) {
    const [user, setUser] = useState(initialUser)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleUpdateFlag = async (flag: 'is_admin' | 'is_staff', value: boolean) => {
        setLoading(true)
        try {
            const result = await updateProfile(user.id, { [flag]: value })
            if (result.success) {
                setUser({ ...user, [flag]: value })
                toast.success(`User updated successfully`)
            } else {
                toast.error(result.error || "Failed to update user")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (action: 'suspend' | 'reactivate') => {
        setLoading(true)
        try {
            const result = action === 'suspend'
                ? await suspendUsers([user.id])
                : await reactivateUsers([user.id])

            if (result.success) {
                setUser({ ...user, account_status: action === 'suspend' ? 'suspended' : 'active' })
                toast.success(`User ${action}ed successfully`)
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Users
            </Button>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Profile Overview Card */}
                <Card className="w-full md:w-1/3 glass-card">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback className="text-2xl">{user.full_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold">{user.full_name}</h2>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Badge variant={user.account_status === 'active' ? 'default' : 'destructive'} className="capitalize">
                                    {user.account_status}
                                </Badge>
                                <Badge variant="outline" className="capitalize">{user.role}</Badge>
                                {user.is_admin && <Badge className="bg-purple-600">Admin</Badge>}
                                {user.is_staff && <Badge className="bg-blue-600">Staff</Badge>}
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{user.phone || 'No phone number'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t space-y-3">
                            <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Quick Actions</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {user.is_admin ? (
                                    <Button variant="outline" size="sm" onClick={() => handleUpdateFlag('is_admin', false)} disabled={loading} className="w-full justify-start text-orange-600">
                                        <ShieldOff className="h-4 w-4 mr-2" /> Revoke Admin
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => handleUpdateFlag('is_admin', true)} disabled={loading} className="w-full justify-start text-purple-600">
                                        <Shield className="h-4 w-4 mr-2" /> Promote to Admin
                                    </Button>
                                )}

                                {user.is_staff ? (
                                    <Button variant="outline" size="sm" onClick={() => handleUpdateFlag('is_staff', false)} disabled={loading} className="w-full justify-start text-orange-600">
                                        <ShieldOff className="h-4 w-4 mr-2" /> Remove Staff Access
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => handleUpdateFlag('is_staff', true)} disabled={loading} className="w-full justify-start text-blue-600">
                                        <Shield className="h-4 w-4 mr-2" /> Promote to Staff
                                    </Button>
                                )}

                                {user.account_status === 'suspended' ? (
                                    <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('reactivate')} disabled={loading} className="w-full justify-start text-green-600">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Reactivate Account
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => handleStatusUpdate('suspend')} disabled={loading} className="w-full justify-start text-destructive">
                                        <Ban className="h-4 w-4 mr-2" /> Suspend Account
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Area */}
                <div className="flex-1 w-full space-y-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-background/50 border">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                            <TabsTrigger value="financials">Financials</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Shield className="h-4 w-4" /> Account Type
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold capitalize">{user.role}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Users className="h-4 w-4" /> Verification
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-2xl font-bold capitalize">{user.verification_status || 'Pending'}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {user.referred_by && (
                                <Card className="border-pink-500/20 bg-pink-500/5">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-pink-600 flex items-center gap-2">
                                            <Users className="h-4 w-4" /> Referral Info
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-medium">Joined via referral link</p>
                                        <p className="text-sm text-muted-foreground">Referred by: {user.referrer?.full_name || 'System'}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Additional Metadata / Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">User Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Newsletter Subscription</p>
                                            <p className="text-xs text-muted-foreground">Receive updates and marketing emails</p>
                                        </div>
                                        <Badge variant="outline">Enabled</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Two-Factor Authentication</p>
                                            <p className="text-xs text-muted-foreground">Extra layer of security</p>
                                        </div>
                                        <Badge variant="outline" className="text-muted-foreground">Disabled</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="activity">
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>Activity logs will be displayed here soon.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="financials">
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>Transaction history and payout info available in dedicated affiliate/owner pages.</p>
                                    {user.role === 'affiliate' && (
                                        <Button variant="link" onClick={() => router.push(`/admin/affiliates/${user.id}`)} className="mt-2">
                                            View Affiliate Dashboard <ExternalLink className="ml-2 h-3 w-3" />
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
