"use client"

import { useState, useCallback } from 'react'
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin } from 'lucide-react'

const libraries: ("places")[] = ["places"]

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
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
    const [address, setAddress] = useState(initialAddress)
    const [mapCenter, setMapCenter] = useState({ lat: -1.2921, lng: 36.8219 }) // Nairobi default
    const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null)

    const onLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
        setAutocomplete(autocompleteInstance)
    }, [])

    const onPlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace()

            if (place.geometry?.location) {
                const lat = place.geometry.location.lat()
                const lng = place.geometry.location.lng()
                const formattedAddress = place.formatted_address || ''

                setAddress(formattedAddress)
                setMapCenter({ lat, lng })
                setMarkerPosition({ lat, lng })

                onLocationSelect({
                    address: formattedAddress,
                    latitude: lat,
                    longitude: lng,
                })
            }
        }
    }

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat()
            const lng = e.latLng.lng()

            setMarkerPosition({ lat, lng })

            // Reverse geocode to get address
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                    const formattedAddress = results[0].formatted_address
                    setAddress(formattedAddress)
                    onLocationSelect({
                        address: formattedAddress,
                        latitude: lat,
                        longitude: lng,
                    })
                }
            })
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="location">Location *</Label>
                <LoadScript
                    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                    libraries={libraries}
                >
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="location"
                                type="text"
                                placeholder="Search for a location..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className={`pl-10 ${error ? 'border-destructive' : ''}`}
                            />
                        </div>
                    </Autocomplete>

                    <div className="mt-4 rounded-lg overflow-hidden border">
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '300px' }}
                            center={mapCenter}
                            zoom={13}
                            onClick={handleMapClick}
                        >
                            {markerPosition && <Marker position={markerPosition} />}
                        </GoogleMap>
                    </div>
                </LoadScript>
                {error && <p className="text-sm text-destructive mt-1">{error}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                    Search for a location or click on the map to select
                </p>
            </div>
        </div>
    )
}
