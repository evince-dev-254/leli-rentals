"use client"

import { Search, MapPin, Calendar, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"

interface SearchBarProps {
    searchQuery: string
    onSearchChange: (value: string) => void
    onFilterClick?: () => void
    locationFilter?: string
    onLocationChange?: (value: string) => void
    showFilters?: boolean
    className?: string
}

export function SearchBar({
    searchQuery,
    onSearchChange,
    onFilterClick,
    locationFilter,
    onLocationChange,
    showFilters = true,
    className
}: SearchBarProps) {
    return (
        <GlassCard className={cn("p-2", className)}>
            <div className="flex items-center gap-2">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search for anything..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                    />
                </div>

                {/* Location Filter */}
                {onLocationChange && (
                    <div className="hidden md:flex items-center gap-2 px-4 border-l border-gray-200 dark:border-gray-700">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Location"
                            value={locationFilter}
                            onChange={(e) => onLocationChange(e.target.value)}
                            className="w-40 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                )}

                {/* Filter Button */}
                {showFilters && onFilterClick && (
                    <Button
                        onClick={onFilterClick}
                        variant="ghost"
                        size="lg"
                        className="h-12 px-6 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <SlidersHorizontal className="h-5 w-5 mr-2" />
                        <span className="hidden sm:inline">Filters</span>
                    </Button>
                )}

                {/* Search Button */}
                <Button
                    size="lg"
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                >
                    <Search className="h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline">Search</span>
                </Button>
            </div>
        </GlassCard>
    )
}
