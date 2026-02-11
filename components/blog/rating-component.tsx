"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

interface RatingComponentProps {
    blogId: string
    initialRating?: number
    reviewCount?: number
}

export function RatingComponent({ blogId, initialRating = 0, reviewCount = 0 }: RatingComponentProps) {
    const [rating, setRating] = useState(Math.round(initialRating))
    const [hover, setHover] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined)

    // Listen for auth state changes
    useEffect(() => {
        // Initial check
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setCurrentUserId(session.user.id)
            }
        }
        getSession()

        // Realtime subscription
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setCurrentUserId(session?.user?.id)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleRate = async (value: number) => {
        if (!currentUserId) {
            toast.error("Please log in to rate this post")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch("/api/blog/rate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blog_id: blogId, user_id: currentUserId, rating: value }),
            })

            if (!response.ok) throw new Error("Failed to submit rating")

            setRating(value)
            toast.success("Thank you for your rating!")
        } catch (error) {
            console.error(error)
            toast.error("Failed to submit rating. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 p-6 bg-card rounded-2xl border border-border">
            <div className="flex items-center justify-between">
                <h4 className="font-bold text-lg">Rate this article</h4>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MessageSquare className="h-4 w-4" />
                    <span>{reviewCount} reviews</span>
                </div>
            </div>

            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        disabled={isSubmitting}
                        className="focus:outline-none transition-transform hover:scale-110"
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => handleRate(star)}
                        type="button"
                    >
                        <Star
                            className={`h-8 w-8 ${(hover || rating) >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                                } transition-colors`}
                        />
                    </button>
                ))}
            </div>
            <p className="text-sm text-muted-foreground">
                {rating > 0 ? `You rated this ${rating} stars` : "Click a star to rate"}
            </p>
        </div>
    )
}
