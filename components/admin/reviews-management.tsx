"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, Search, Filter, MessageSquare, AlertCircle, Trash2, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { LoadingLogo } from "@/components/ui/loading-logo"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ReviewsManagement() {
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRating, setFilterRating] = useState<number | null>(null)

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    *,
                    listing:listings (id, title, owner_id),
                    reviewer:user_profiles!reviewer_id (id, full_name, avatar_url)
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setReviews(data || [])
        } catch (error) {
            console.error("Error fetching reviews:", error)
            toast.error("Failed to load reviews")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return

        try {
            const { error } = await supabase.from('reviews').delete().eq('id', id)
            if (error) throw error
            toast.success("Review deleted")
            setReviews(reviews.filter(r => r.id !== id))
        } catch (error) {
            toast.error("Failed to delete review")
        }
    }

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            review.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.reviewer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRating = filterRating ? review.rating === filterRating : true

        return matchesSearch && matchesRating
    })

    if (loading) return <div className="flex justify-center p-20"><LoadingLogo size={50} /></div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Reviews Management</h1>
                    <p className="text-muted-foreground">Monitor and moderate user reviews</p>
                </div>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" />
                            All Reviews ({reviews.length})
                        </CardTitle>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search reviews..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Filter className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setFilterRating(null)}>
                                        All Ratings
                                    </DropdownMenuItem>
                                    {[5, 4, 3, 2, 1].map(r => (
                                        <DropdownMenuItem key={r} onClick={() => setFilterRating(r)}>
                                            {r} Stars {filterRating === r && <CheckCircle className="ml-2 h-3 w-3 text-primary" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredReviews.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No reviews found.
                            </div>
                        ) : (
                            filteredReviews.map((review) => (
                                <div key={review.id} className="p-4 rounded-lg bg-card/50 border border-border flex flex-col md:flex-row gap-4 justify-between group">
                                    <div className="flex gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={review.reviewer?.avatar_url} />
                                            <AvatarFallback>{review.reviewer?.full_name?.[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{review.reviewer?.full_name || 'Anonymous'}</span>
                                                <span className="text-xs text-muted-foreground">reviewed</span>
                                                <span className="font-medium text-primary">{review.listing?.title}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-500 my-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                                                ))}
                                                <span className="text-xs text-muted-foreground ml-2">
                                                    {format(new Date(review.created_at), 'MMM d, yyyy')}
                                                </span>
                                            </div>
                                            <p className="text-sm mt-1">{review.comment}</p>
                                        </div>
                                    </div>
                                    <div className="self-start md:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(review.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
