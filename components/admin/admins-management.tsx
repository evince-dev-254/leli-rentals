"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Search, UserCog } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAdmins, updateProfile } from "@/lib/actions/dashboard-actions"
import { getAmISuperAdmin } from "@/lib/actions/admin-actions"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { UserSelector } from "./user-selector"

export function AdminsManagement() {
    const [admins, setAdmins] = useState<any[]>([])
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null)
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)

    useEffect(() => {
        loadAdmins()
        getCurrentUser()
    }, [])

    const getCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setCurrentUserEmail(user.email ?? null)
            const isSuper = await getAmISuperAdmin()
            setIsSuperAdmin(isSuper)
        }
    }

    const loadAdmins = async () => {
        try {
            const data = await getAdmins()
            setAdmins(data || [])
        } catch (error) {
            console.error("Error loading admins:", error)
            toast.error("Failed to load admins")
        } finally {
            setLoading(false)
        }
    }

    const handleAddAdmin = async () => {
        if (!isSuperAdmin) {
            toast.error("Restricted: Only the Super Admin can add new admins.")
            return
        }

        if (!selectedUser) return

        try {
            if (selectedUser.is_admin || selectedUser.role === 'admin') {
                toast.info("User is already an admin")
                setSelectedUser(null)
                return
            }

            await updateProfile(selectedUser.id, { is_admin: true, role: 'admin' })
            toast.success(`${selectedUser.email} promoted to admin`)
            setSelectedUser(null)
            loadAdmins()
        } catch (error: any) {
            console.error("Error adding admin:", error)
            toast.error("Failed to add admin. Please try again.")
        }
    }

    const handleRemoveAdmin = async (adminId: string, email: string) => {
        if (email === currentUserEmail) {
            toast.error("You cannot remove yourself from admins")
            return
        }

        if (!isSuperAdmin) {
            toast.error("Restricted: Only the Super Admin can remove admins.")
            return
        }

        if (!confirm(`Are you sure you want to remove admin rights from ${email}?`)) return

        try {
            const adminUser = admins.find(a => a.id === adminId);
            const updates: any = { is_admin: false };
            if (adminUser?.role === 'admin') {
                updates.role = 'renter'; // Default fallback role
            }

            await updateProfile(adminId, updates)
            toast.success(`${email} removed from admins`)
            loadAdmins()
        } catch (error) {
            console.error("Error removing admin:", error)
            toast.error("Failed to remove admin")
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Manage Admins</h1>
                <p className="text-muted-foreground">View and manage administrators with access to this dashboard</p>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserCog className="h-5 w-5" />
                        Admin Access
                    </CardTitle>
                    <CardDescription>
                        Grant or revoke administrator privileges.
                        <span className="block mt-1 text-amber-600 font-medium">
                            Note: Only Super Admins can modify the admin list.
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label>Select User to Promote</Label>
                            <UserSelector
                                onSelect={setSelectedUser}
                                excludeRoles={['admin']}
                                placeholder="Search users by name or email..."
                                disabled={!isSuperAdmin}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Button onClick={handleAddAdmin} disabled={!selectedUser}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Admin
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h4 className="font-medium">Current Admins</h4>
                        {loading ? (
                            <p className="text-muted-foreground">Loading admins...</p>
                        ) : (
                            <div className="grid gap-4">
                                {admins.map((admin) => (
                                    <div key={admin.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={admin.avatar_url || undefined} />
                                                <AvatarFallback>
                                                    {admin.full_name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{admin.full_name || "Unknown Name"}</p>
                                                <p className="text-sm text-muted-foreground">{admin.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {admin.email === currentUserEmail && (
                                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">You</span>
                                            )}

                                            {/* Super Admin Badge */}
                                            {admin.is_super_admin && (
                                                <span className="text-xs text-amber-600 bg-amber-100 border border-amber-200 px-2 py-1 rounded font-medium">Super Admin</span>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                                                disabled={admin.email === currentUserEmail || !isSuperAdmin}
                                                title={!isSuperAdmin ? "Restricted to Super Admin" : "Remove Admin"}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
