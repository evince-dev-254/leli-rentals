"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface LeaveReviewDialogProps {
    bookingId: string
    listingId: string
    listingTitle: string
    listingImage?: string
    onReviewSubmitted?: () => void
    children?: React.ReactNode
}

export function LeaveReviewDialog({ bookingId, listingId, listingTitle, listingImage, onReviewSubmitted, children }: LeaveReviewDialogProps) {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating")
            return
        }

        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const { error } = await supabase
                .from('reviews')
                .insert({
                    booking_id: bookingId,
                    listing_id: listingId,
                    reviewer_id: user.id,
                    rating,
                    comment
                })

            if (error) throw error

            toast.success("Review submitted successfully!")
            setOpen(false)
            if (onReviewSubmitted) onReviewSubmitted()
        } catch (error) {
            console.error("Error submitting review:", error)
            toast.error("Failed to submit review")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || <Button size="sm" variant="secondary">Leave Review</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Review {listingTitle}</DialogTitle>
                    <DialogDescription>
                        Share your experience with this rental.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    {listingImage && (
                        <div className="flex justify-center">
                            <img src={listingImage} alt={listingTitle} className="w-32 h-24 object-cover rounded-md" />
                        </div>
                    )}

                    <div className="space-y-2 text-center">
                        <Label>Rating</Label>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            id="comment"
                            placeholder="Tell us about your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Submit Review
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
