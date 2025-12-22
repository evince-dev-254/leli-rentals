"use client"

import { useState } from "react"
import { Autocomplete, useLoadScript } from "@react-google-maps/api"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2 } from "lucide-react"
import { kenyaCounties } from "@/lib/kenya-counties"

const libraries: ("places")[] = ["places"]

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
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    })

    const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(autocompleteInstance)
    }

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace()

            let city = ""
            let area = ""
            const address = place.formatted_address || ""
            const lat = place.geometry?.location?.lat() || 0
            const lng = place.geometry?.location?.lng() || 0

            if (place.address_components) {
                place.address_components.forEach(component => {
                    const types = component.types
                    const value = component.long_name

                    if (types.includes("administrative_area_level_1") || types.includes("locality")) {
                        const match = kenyaCounties.find(c =>
                            value.toLowerCase().includes(c.toLowerCase()) ||
                            c.toLowerCase().includes(value.toLowerCase())
                        )
                        if (match) city = match
                    }

                    if (types.includes("sublocality") || types.includes("neighborhood") || types.includes("route")) {
                        if (!area || types.includes("neighborhood")) {
                            area = value
                        }
                    }
                })
            }

            setInputValue(address)
            onLocationSelect({
                address,
                city,
                area,
                coordinates: { lat, lng }
            })
        }
    }

    if (loadError) {
        return (
            <div className="relative">
                <Input disabled placeholder="Error loading maps" className={className} />
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="relative">
                <Input disabled placeholder="Loading maps..." className={className} />
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="relative w-full">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className={`pl-10 ${className}`}
                    />
                </div>
            </Autocomplete>
        </div>
    )
}
