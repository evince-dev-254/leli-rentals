"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { getUserFavorites } from '@/lib/favorites'
import { createClient } from '@/lib/supabase/client'

interface FavoriteWithListing {
    id: string
    listing_id: string
    created_at: string
    listing?: any
}

export default function FavoritesPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [favorites, setFavorites] = useState<FavoriteWithListing[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/sign-in?redirect=/favorites')
            return
        }

        if (user?.id) {
            loadFavorites()
        }
    }, [user, isLoaded, router])

    const loadFavorites = async () => {
        try {
            setIsLoading(true)
            const favs = await getUserFavorites(user!.id)

            // Fetch listing details for each favorite
            const supabase = createClient()
            const favoritesWithListings = await Promise.all(
                favs.map(async (fav) => {
                    const { data: listing } = await supabase
                        .from('listings')
                        .select('*')
                        .eq('id', fav.listing_id)
                        .single()

                    return {
                        ...fav,
                        listing
                    }
                })
            )

            setFavorites(favoritesWithListings.filter(f => f.listing))
        } catch (error) {
            console.error('Error loading favorites:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const removeFavorite = async (listingId: string) => {
        try {
            const response = await fetch('/api/favorites', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId })
            })

            if (response.ok) {
                setFavorites(favorites.filter(f => f.listing_id !== listingId))
            }
        } catch (error) {
            console.error('Error removing favorite:', error)
        }
    }

    if (!isLoaded || isLoading) {
        return (
            <>
                <Header />
                <LoadingSpinner
                    message="Loading your favorites..."
                    variant="default"
                    fullScreen={true}
                    showHeader={false}
                />
            </>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-pink-950">
            <Header />

            <main className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="h-8 w-8 text-red-500 fill-current" />
                        <h1 className="font-heading text-4xl font-bold text-gray-900 dark:text-white">
                            My Favorites
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {/* Favorites Grid */}
                {favorites.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h2 className="font-heading text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                                No favorites yet
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Start exploring and save items you love!
                            </p>
                            <Link href="/categories">
                                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                    Browse Categories
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((favorite) => (
                            <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                                    {favorite.listing?.images?.[0] && (
                                        <img
                                            src={favorite.listing.images[0]}
                                            alt={favorite.listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <Badge className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90">
                                        {favorite.listing?.category}
                                    </Badge>
                                </div>

                                <CardHeader>
                                    <CardTitle className="line-clamp-1">{favorite.listing?.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {favorite.listing?.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                            KSh {favorite.listing?.price_per_day?.toLocaleString()}/day
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/listings/${favorite.listing_id}`} className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeFavorite(favorite.listing_id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
