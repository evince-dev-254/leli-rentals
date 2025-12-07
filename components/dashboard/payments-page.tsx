"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { getBookings } from "@/lib/actions/dashboard-actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Receipt, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function PaymentsPage() {
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        async function fetchPayments() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // Fetch bookings as renter to see what they paid for
                const data = await getBookings(user.id, 'renter')
                setBookings(data || [])
            }
            setLoading(false)
        }
        fetchPayments()
    }, [])

    const filteredBookings = bookings.filter(b =>
        b.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getTotalSpent = () => {
        return filteredBookings
            .filter(b => b.status === "completed" || b.status === "confirmed")
            .reduce((acc, curr) => acc + (Number(curr.total_amount) || 0), 0)
    }

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Payments Record</h1>
                <p className="text-muted-foreground">Track all payments made for your rentals</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KSh {getTotalSpent().toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">On confirmed/completed bookings</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookings.length}</div>
                        <p className="text-xs text-muted-foreground">Lifetime bookings</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>Detailed list of your rental payments</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search rentals..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">No payment records found.</div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-5 font-medium text-sm text-muted-foreground border-b pb-2">
                                <div className="col-span-2">Item / Service</div>
                                <div>Date</div>
                                <div>Status</div>
                                <div className="text-right">Amount</div>
                            </div>
                            {filteredBookings.map((booking) => (
                                <div key={booking.id} className="grid grid-cols-5 items-center py-4 border-b last:border-0 hover:bg-muted/10 transition-colors">
                                    <div className="col-span-2 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                                            <img
                                                src={booking.listing?.images?.[0] || '/placeholder.svg'}
                                                alt={booking.listing?.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium">{booking.listing?.title}</div>
                                            <div className="text-xs text-muted-foreground">ID: {booking.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        {new Date(booking.created_at).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <Badge variant={
                                            booking.status === 'completed' ? 'default' :
                                                booking.status === 'confirmed' ? 'secondary' :
                                                    booking.status === 'cancelled' ? 'destructive' : 'outline'
                                        } className="capitalize">
                                            {booking.status}
                                        </Badge>
                                    </div>
                                    <div className="text-right font-medium">
                                        KSh {Number(booking.total_amount).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
