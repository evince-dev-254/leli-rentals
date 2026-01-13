"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Megaphone, Mail, ExternalLink, ShieldCheck } from "lucide-react"

export function AdvertisersManagement() {
    const [advertisers, setAdvertisers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadAdvertisers() {
            setLoading(true)
            try {
                // Fetch users who are owners OR explicitly marked as advertisers
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .or('role.eq.owner,is_advertiser.eq.true')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setAdvertisers(data || [])
            } catch (err) {
                console.error("Error loading advertisers", err)
            } finally {
                setLoading(false)
            }
        }
        loadAdvertisers()
    }, [])

    const toggleAdvertiser = async (userId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ is_advertiser: !currentStatus })
                .eq('id', userId)

            if (error) throw error
            setAdvertisers(advertisers.map(a => a.id === userId ? { ...a, is_advertiser: !currentStatus } : a))
        } catch (err) {
            console.error("Error toggling advertiser status", err)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Advertisers</CardTitle>
                        <Megaphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{advertisers.length}</div>
                        <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Verified Advertisers</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{advertisers.filter(a => a.is_advertiser).length}</div>
                        <p className="text-xs text-muted-foreground">Paying promoters</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Advertiser Accounts</CardTitle>
                    <CardDescription>Manage owners running paid advertisements</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Advertiser</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Promotion Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6">Loading advertisers...</TableCell>
                                </TableRow>
                            ) : advertisers.map((advertiser) => (
                                <TableRow key={advertiser.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={advertiser.avatar_url} />
                                                <AvatarFallback>{advertiser.full_name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{advertiser.full_name}</div>
                                                <div className="text-xs text-muted-foreground">{advertiser.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {advertiser.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={advertiser.is_advertiser ? 'default' : 'secondary'}>
                                            {advertiser.is_advertiser ? 'Promoting' : 'Standard Owner'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" title="Contact">
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant={advertiser.is_advertiser ? "destructive" : "default"}
                                                size="sm"
                                                onClick={() => toggleAdvertiser(advertiser.id, advertiser.is_advertiser)}
                                            >
                                                {advertiser.is_advertiser ? 'Disable Ad' : 'Enable Ad'}
                                            </Button>
                                        </div>
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
