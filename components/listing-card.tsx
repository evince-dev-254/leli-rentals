"use client"

import { Listing } from "@/lib/listings-service"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Share2, MapPin, Star, MessageCircle, Calendar, ArrowRight, Car, Home, Wrench, Music, Shirt, Laptop, Dumbbell, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ListingCardProps {
    listing: Listing
    isLiked?: boolean
    isSaved?: boolean
    isLoadingInteraction?: boolean
    onLike?: (id: string) => void
    onSave?: (id: string) => void
    onShare?: (id: string, title: string) => void
    onBook?: (listing: Listing) => void
    onViewDetails?: (id: string) => void
    onMessageOwner?: (listing: Listing) => void
    className?: string
    priority?: boolean
}

export function ListingCard({
    listing,
    isLiked,
    isSaved,
    isLoadingInteraction,
    onLike,
    onSave,
    onShare,
    onBook,
    onViewDetails,
    onMessageOwner,
    className,
    priority = false
}: ListingCardProps) {
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "vehicles": return Car
            case "homes": return Home
            case "equipment": return Wrench
            case "events": return Music
            case "fashion": return Shirt
            case "tech": return Laptop
            case "sports": return Dumbbell
            default: return Camera
        }
    }

    const IconComponent = getCategoryIcon(listing.category)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800",
                className
            )}
        >
            {/* Image Container - Immersive 4:5 Aspect Ratio */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={listing.image || listing.images?.[0] || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading={priority ? "eager" : "lazy"}
                    onError={(e) => {
                        const t = e.target as HTMLImageElement
                        t.src = "/placeholder.svg"
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-900 dark:text-white hover:bg-white border-0">
                        <IconComponent className="h-3 w-3 mr-1" />
                        <span className="capitalize">{listing.category}</span>
                    </Badge>
                    {listing.owner.verified && (
                        <Badge variant="secondary" className="bg-blue-500/90 text-white border-0 backdrop-blur-md">
                            Verified
                        </Badge>
                    )}
                </div>

                {/* Action Buttons (Top Right) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation()
                            listing.id && onLike?.(listing.id)
                        }}
                        disabled={isLoadingInteraction}
                        className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-red-500 transition-colors"
                    >
                        <Heart className={cn("h-5 w-5", isLiked && "fill-current text-red-500")} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation()
                            listing.id && onSave?.(listing.id)
                        }}
                        disabled={isLoadingInteraction}
                        className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-blue-500 transition-colors"
                    >
                        <Star className={cn("h-5 w-5", isSaved && "fill-current text-blue-500")} />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation()
                            listing.id && onShare?.(listing.id, listing.title)
                        }}
                        className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-green-500 transition-colors"
                    >
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {/* Price Tag */}
                    <div className="mb-3 inline-block">
                        <div className="flex items-baseline gap-1 bg-blue-600/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg">
                            <span className="text-lg font-bold">KSh {listing.price.toLocaleString()}</span>
                            <span className="text-xs opacity-80 font-medium">/ {listing.price_type?.replace('per ', '') || 'day'}</span>
                        </div>
                    </div>

                    <h3 className="font-heading text-xl font-bold leading-tight mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors">
                        {listing.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-200 mb-4">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <span className="truncate">{listing.location}</span>
                    </div>

                    {/* Expanded Content on Hover */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300">
                        <div className="overflow-hidden">
                            <div className="pt-2 flex items-center justify-between border-t border-white/20">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8 border-2 border-white/20">
                                        <AvatarImage src={listing.owner.avatar} />
                                        <AvatarFallback>{listing.owner.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium">{listing.owner.name}</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                            <span className="text-xs opacity-80">{listing.rating} ({listing.reviews})</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 px-3 text-xs bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onMessageOwner?.(listing)
                                        }}
                                    >
                                        <MessageCircle className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="h-8 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onBook?.(listing)
                                        }}
                                    >
                                        Book
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Click handler for the whole card */}
            <div
                className="absolute inset-0 z-0 cursor-pointer"
                onClick={() => listing.id && onViewDetails?.(listing.id)}
            />
        </motion.div>
    )
}
