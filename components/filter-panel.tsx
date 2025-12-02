"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface FilterPanelProps {
    isOpen: boolean
    onClose: () => void
    priceRange: { min: number; max: number }
    onPriceChange: (range: { min: number; max: number }) => void
    sortBy: string
    onSortChange: (value: string) => void
    ratingFilter: string
    onRatingChange: (value: string) => void
    availabilityFilter: string
    onAvailabilityChange: (value: string) => void
    onReset: () => void
    className?: string
}

export function FilterPanel({
    isOpen,
    onClose,
    priceRange,
    onPriceChange,
    sortBy,
    onSortChange,
    ratingFilter,
    onRatingChange,
    availabilityFilter,
    onAvailabilityChange,
    onReset,
    className
}: FilterPanelProps) {
    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Panel */}
            <GlassCard
                className={cn(
                    "fixed lg:sticky top-0 right-0 lg:right-auto h-screen lg:h-auto w-80 lg:w-full p-6 z-50 overflow-y-auto",
                    "lg:relative lg:z-0",
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-lg font-bold">Filters</h3>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="text-sm"
                        >
                            Reset
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="lg:hidden"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                    <Label className="text-sm font-semibold mb-3 block">Sort By</Label>
                    <RadioGroup value={sortBy} onValueChange={onSortChange}>
                        <div className="space-y-2">
                            {[
                                { value: "newest", label: "Newest First" },
                                { value: "oldest", label: "Oldest First" },
                                { value: "price-low", label: "Price: Low to High" },
                                { value: "price-high", label: "Price: High to Low" },
                                { value: "rating", label: "Highest Rated" },
                                { value: "popularity", label: "Most Popular" },
                            ].map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <Label htmlFor={option.value} className="font-normal cursor-pointer">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <Label className="text-sm font-semibold mb-3 block">
                        Price Range (KSh)
                    </Label>
                    <div className="space-y-4">
                        <Slider
                            value={[priceRange.min, priceRange.max]}
                            onValueChange={([min, max]) => onPriceChange({ min, max })}
                            max={100000}
                            step={1000}
                            className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>KSh {priceRange.min.toLocaleString()}</span>
                            <span>KSh {priceRange.max.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                    <Label className="text-sm font-semibold mb-3 block">Minimum Rating</Label>
                    <RadioGroup value={ratingFilter} onValueChange={onRatingChange}>
                        <div className="space-y-2">
                            {[
                                { value: "any", label: "Any Rating" },
                                { value: "4", label: "4+ Stars" },
                                { value: "4.5", label: "4.5+ Stars" },
                            ].map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={`rating-${option.value}`} />
                                    <Label htmlFor={`rating-${option.value}`} className="font-normal cursor-pointer">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                </div>

                {/* Availability */}
                <div className="mb-6">
                    <Label className="text-sm font-semibold mb-3 block">Availability</Label>
                    <RadioGroup value={availabilityFilter} onValueChange={onAvailabilityChange}>
                        <div className="space-y-2">
                            {[
                                { value: "any", label: "All Listings" },
                                { value: "available", label: "Available Now" },
                            ].map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option.value} id={`avail-${option.value}`} />
                                    <Label htmlFor={`avail-${option.value}`} className="font-normal cursor-pointer">
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                </div>

                {/* Apply Button (Mobile) */}
                <Button
                    onClick={onClose}
                    className="w-full lg:hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                    Apply Filters
                </Button>
            </GlassCard>
        </>
    )
}
