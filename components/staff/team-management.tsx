"use client"
import { useState, useEffect } from "react"
import { getStaffTeam, promoteToStaff } from "@/lib/actions/staff-actions"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, ShieldCheck } from "lucide-react"

export function TeamManagement() {
    const [team, setTeam] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [promoting, setPromoting] = useState(false)
    const [newEmail, setNewEmail] = useState("")
    const [open, setOpen] = useState(false)

    useEffect(() => {
        loadTeam()
    }, [])

    async function loadTeam() {
        setLoading(true)
        try {
            const data = await getStaffTeam()
            setTeam(data)
        } catch (err) {
            console.error("Error loading team", err)
        } finally {
            setLoading(false)
        }
    }

    const handlePromote = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newEmail) return

        setPromoting(true)
        try {
            const result = await promoteToStaff(newEmail)
            if (result.success) {
                toast.success(result.message)
                setOpen(false)
                setNewEmail("")
                loadTeam()
            } else {
                toast.error(result.error || "Failed to promote user")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setPromoting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Staff Management</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Staff Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handlePromote}>
                            <DialogHeader>
                                <DialogTitle>Promote to Staff</DialogTitle>
                                <DialogDescription>
                                    Enter the email address of the user you want to promote to the staff team.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        placeholder="user@example.com"
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={promoting}>
                                    {promoting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Promoting...
                                        </>
                                    ) : (
                                        'Promote User'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Sales & Staff Team</CardTitle>
                    <CardDescription>Internal members with staff portal access</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Member</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined At</TableHead>
                                <TableHead className="text-right">Contact</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6">Loading team...</TableCell>
                                </TableRow>
                            ) : team.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No staff members found.</TableCell>
                                </TableRow>
                            ) : team.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={member.avatar_url} />
                                                <AvatarFallback>{member.full_name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{member.full_name}</div>
                                                <div className="text-xs text-muted-foreground">{member.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
                                            <ShieldCheck className="h-3 w-3 mr-1" />
                                            Staff
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="outline" asChild>
                                            <a href={`mailto:${member.email}`}>
                                                <Mail className="h-4 w-4 mr-2" />
                                                Email
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
