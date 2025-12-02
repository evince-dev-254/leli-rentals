"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
    listingId: string
    className?: string
    showCount?: boolean
}

export function FavoriteButton({ listingId, className, showCount = false }: FavoriteButtonProps) {
    const { user } = useUser()
    const { toast } = useToast()
    const [isFavorited, setIsFavorited] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [favoriteCount, setFavoriteCount] = useState(0)

    useEffect(() => {
        if (user?.id) {
            checkFavoriteStatus()
            if (showCount) {
                fetchFavoriteCount()
            }
        }
    }, [user?.id, listingId])

    const checkFavoriteStatus = async () => {
        try {
            const response = await fetch(`/api/favorites/check?listingId=${listingId}`)
            const data = await response.json()
            setIsFavorited(data.isFavorite)
        } catch (error) {
            console.error('Error checking favorite status:', error)
        }
    }

    const fetchFavoriteCount = async () => {
        try {
            const response = await fetch(`/api/favorites/count?listingId=${listingId}`)
            const data = await response.json()
            setFavoriteCount(data.count)
        } catch (error) {
            console.error('Error fetching favorite count:', error)
        }
    }

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            toast({
                title: "Sign in required",
                description: "Please sign in to save favorites",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch('/api/favorites', {
                method: isFavorited ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ listingId })
            })

            const data = await response.json()

            if (data.success) {
                setIsFavorited(!isFavorited)

                if (showCount) {
                    setFavoriteCount(prev => isFavorited ? prev - 1 : prev + 1)
                }

                toast({
                    title: isFavorited ? "Removed from favorites" : "Added to favorites",
                    description: isFavorited
                        ? "Item removed from your wishlist"
                        : "Item saved to your wishlist",
                    duration: 2000
                })
            } else {
                throw new Error(data.error || 'Failed to update favorites')
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
            toast({
                title: "Error",
                description: "Failed to update favorites. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            disabled={isLoading}
            className={cn(
                "relative group",
                isFavorited && "text-red-500 hover:text-red-600",
                className
            )}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart
                className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isFavorited && "fill-current",
                    isLoading && "animate-pulse"
                )}
            />
            {showCount && favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {favoriteCount > 99 ? '99+' : favoriteCount}
                </span>
            )}
        </Button>
    )
}
