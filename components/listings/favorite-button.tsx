"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/lib/favorites-context"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface FavoriteButtonProps {
    listingId: string
    className?: string
    variant?: "ghost" | "secondary" | "outline"
    size?: "icon" | "sm" | "default"
}

export function FavoriteButton({
    listingId,
    className,
    variant = "ghost",
    size = "icon"
}: FavoriteButtonProps) {
    const { isFavorite, toggleFavorite } = useFavorites()
    const active = isFavorite(listingId)

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(listingId)

        if (!active) {
            toast.success("Added to favorites")
        } else {
            toast.info("Removed from favorites")
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={cn(
                "rounded-full transition-all duration-300",
                active
                    ? "bg-white text-rose-500 shadow-md scale-110"
                    : "bg-white/80 backdrop-blur-sm text-gray-500 hover:text-rose-500 hover:bg-white",
                className
            )}
            onClick={handleToggle}
        >
            <Heart
                className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    active && "fill-current"
                )}
            />
        </Button>
    )
}
