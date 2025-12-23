"use client"

import { useState, useEffect, useCallback } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Search as SearchIcon, Loader2 } from 'lucide-react'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

interface LocationPickerProps {
    onLocationSelect: (location: {
        address: string
        latitude: number
        longitude: number
    }) => void
    initialAddress?: string
    error?: string
}

export function LocationPicker({ onLocationSelect, initialAddress = '', error }: LocationPickerProps) {
    const [address, setAddress] = useState(initialAddress)
    const [viewState, setViewState] = useState({
        latitude: -1.2921,
        longitude: 36.8219,
        zoom: 13
    })
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Search for locations using Mapbox Geocoding API
    const handleSearch = async (query: string) => {
        setAddress(query)
        if (query.length < 3) {
            setSuggestions([])
            return
        }

        setIsSearching(true)
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=5`
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
        const formattedAddress = feature.place_name

        setAddress(formattedAddress)
        setMarkerPosition({ lat, lng })
        setViewState((prev) => ({ ...prev, latitude: lat, longitude: lng }))
        setSuggestions([])
        setShowSuggestions(false)

        onLocationSelect({
            address: formattedAddress,
            latitude: lat,
            longitude: lng,
        })
    }

    const handleMapClick = async (e: any) => {
        const { lng, lat } = e.lngLat
        setMarkerPosition({ lat, lng })

        // Reverse geocoding
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&limit=1`
            )
            const data = await response.json()
            if (data.features && data.features[0]) {
                const formattedAddress = data.features[0].place_name
                setAddress(formattedAddress)
                onLocationSelect({
                    address: formattedAddress,
                    latitude: lat,
                    longitude: lng,
                })
            }
        } catch (err) {
            console.error('Error reverse geocoding:', err)
        }
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Label htmlFor="location">Location *</Label>
                <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="location"
                        type="text"
                        placeholder="Search for a location..."
                        value={address}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        className={`pl-10 pr-10 ${error ? 'border-destructive' : ''}`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <SearchIcon className="h-4 w-4 text-muted-foreground" />}
                    </div>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg overflow-hidden">
                        {suggestions.map((feature) => (
                            <button
                                key={feature.id}
                                className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors text-sm"
                                onClick={() => selectLocation(feature)}
                            >
                                {feature.place_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-xl overflow-hidden border h-[300px] relative shadow-inner">
                <Map
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    onClick={handleMapClick}
                    style={{ width: '100%', height: '100%' }}
                >
                    <NavigationControl position="bottom-right" />
                    {markerPosition && (
                        <Marker longitude={markerPosition.lng} latitude={markerPosition.lat} color="#9333ea" />
                    )}
                </Map>
            </div>

            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
            <p className="text-xs text-muted-foreground mt-1">
                Search for a location or click on the map to select
            </p>
        </div>
    )
}
