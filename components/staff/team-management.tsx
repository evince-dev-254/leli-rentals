"use client"
import { useState, useEffect } from "react"
import { getStaffTeam } from "@/lib/actions/staff-actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, ShieldCheck } from "lucide-react"

export function TeamManagement() {
    const [team, setTeam] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
        loadTeam()
    }, [])

    return (
        <div className="space-y-6">
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
