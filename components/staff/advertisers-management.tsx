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
                // Fetch users with 'owner' role as potential advertisers
                const { data: owners, error } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('role', 'owner')
                    .order('created_at', { ascending: false })

                if (error) throw error

                // Mock data for "Ad Status" just for visualization, as there's no real ad system yet
                const enrichedOwners = owners.map(owner => ({
                    ...owner,
                    ad_status: Math.random() > 0.7 ? 'active' : 'inactive',
                    campaigns_count: Math.floor(Math.random() * 5),
                    total_spend: Math.floor(Math.random() * 50000)
                }))

                setAdvertisers(enrichedOwners)
            } catch (err) {
                console.error("Error loading advertisers", err)
            } finally {
                setLoading(false)
            }
        }
        loadAdvertisers()
    }, [])

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
                        <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{advertisers.filter(a => a.ad_status === 'active').length}</div>
                        <p className="text-xs text-muted-foreground">Running promotions</p>
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
                                <TableHead>Ad Status</TableHead>
                                <TableHead>Campaigns</TableHead>
                                <TableHead>Total Spend (Est)</TableHead>
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
                                        <Badge variant={advertiser.ad_status === 'active' ? 'default' : 'secondary'}>
                                            {advertiser.ad_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{advertiser.campaigns_count}</TableCell>
                                    <TableCell>KSh {advertiser.total_spend.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" title="Contact">
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" title="View Profile">
                                                <ExternalLink className="h-4 w-4" />
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
