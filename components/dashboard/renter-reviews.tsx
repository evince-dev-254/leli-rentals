"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { LoadingLogo } from "@/components/ui/loading-logo"

export function RenterReviews() {
    const [loading, setLoading] = useState(true)
    const [reviews, setReviews] = useState<any[]>([])

    useEffect(() => {
        async function fetchReviews() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: revs } = await supabase
                    .from('reviews')
                    .select(`
                    *,
                    listing:listings (title, images)
                `)
                    .eq('reviewer_id', user.id)
                    .order('created_at', { ascending: false })
                setReviews(revs || [])
            }
            setLoading(false)
        }
        fetchReviews()
    }, [])

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <LoadingLogo size={60} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Reviews</h1>
                <p className="text-muted-foreground">Reviews you&apos;ve left for items</p>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Review History</CardTitle>
                    <CardDescription>You have left {reviews.length} reviews</CardDescription>
                </CardHeader>
                <CardContent>
                    {reviews.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">You haven&apos;t left any reviews yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="p-4 rounded-lg bg-background/50 border border-border">
                                    <div className="flex gap-4">
                                        <img
                                            src={review.listing?.images?.[0] || "/placeholder.svg"}
                                            className="w-16 h-16 rounded object-cover"
                                            alt="Item"
                                        />
                                        <div>
                                            <h4 className="font-medium">{review.listing?.title}</h4>
                                            <div className="flex items-center gap-1 text-yellow-500 my-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-muted-foreground italic">&quot;{review.comment}&quot;</p>
                                            <p className="text-xs text-muted-foreground mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                                        </div>
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
