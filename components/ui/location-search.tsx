"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2, Search as SearchIcon } from "lucide-react"
import { kenyaCounties } from "@/lib/kenya-counties"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

interface LocationSearchProps {
    onLocationSelect: (data: {
        address: string
        city: string
        area: string
        coordinates: { lat: number; lng: number }
    }) => void
    placeholder?: string
    className?: string
    defaultValue?: string
}

export function LocationSearch({
    onLocationSelect,
    placeholder = "Search location...",
    className,
    defaultValue = ""
}: LocationSearchProps) {
    const [inputValue, setInputValue] = useState(defaultValue)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)

    const handleSearch = async (query: string) => {
        setInputValue(query)
        if (query.length < 3) {
            setSuggestions([])
            return
        }

        setIsSearching(true)
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=5&country=KE`
            )
            const data = await response.json()
            setSuggestions(data.features || [])
            setShowSuggestions(true)
        } catch (err) {
            console.error('Error fetching suggestions:', err)
        } finally {
            setIsSearching(false)
        }
    }

    const selectLocation = (feature: any) => {
        const [lng, lat] = feature.center
        const address = feature.place_name

        let city = ""
        let area = ""

        // Mapbox context usually contains city, region, etc.
        if (feature.context) {
            feature.context.forEach((ctx: any) => {
                const id = ctx.id
                const text = ctx.text

                if (id.startsWith('place')) {
                    const match = kenyaCounties.find(c =>
                        text.toLowerCase().includes(c.toLowerCase()) ||
                        c.toLowerCase().includes(text.toLowerCase())
                    )
                    if (match) city = match
                }

                if (id.startsWith('neighborhood') || id.startsWith('locality')) {
                    area = text
                }
            })
        }

        // Fallback for city if not found in context but present in place_name
        if (!city) {
            const match = kenyaCounties.find(c =>
                address.toLowerCase().includes(c.toLowerCase())
            )
            if (match) city = match
        }

        setInputValue(address)
        setSuggestions([])
        setShowSuggestions(false)

        onLocationSelect({
            address,
            city,
            area,
            coordinates: { lat, lng }
        })
    }

    return (
        <div className="relative w-full">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    className={`pl-10 pr-10 ${className}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <SearchIcon className="h-4 w-4 text-muted-foreground" />}
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                    {suggestions.map((feature) => (
                        <button
                            key={feature.id}
                            className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors text-sm border-b last:border-0"
                            onClick={() => selectLocation(feature)}
                        >
                            <p className="font-medium truncate">{feature.text}</p>
                            <p className="text-xs text-muted-foreground truncate">{feature.place_name}</p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
