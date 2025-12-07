"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, CheckCircle } from "lucide-react"
import { PolicyDisplay } from "./policy-display"
import type { RentalPolicyType } from "@/lib/constants/rental-policies"
import Image from "next/image"

interface ListingPreviewProps {
    isOpen: boolean
    onClose: () => void
    onEdit: () => void
    onPublish: () => void
    listingData: {
        title: string
        description: string
        category: string
        subcategory?: string
        pricePerDay: number
        pricePerWeek?: number
        pricePerMonth?: number
        location: string
        images: string[]
        features?: Record<string, any>
        rentalPolicyType: RentalPolicyType
        depositAmount?: number
        minRentalPeriod?: number
        maxRentalPeriod?: number
    }
}

export function ListingPreview({
    isOpen,
    onClose,
    onEdit,
    onPublish,
    listingData
}: ListingPreviewProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Preview Listing
                    </DialogTitle>
                    <DialogDescription>
                        This is how your listing will appear to renters
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Images */}
                    {listingData.images && listingData.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-2 aspect-video relative rounded-lg overflow-hidden">
                                <Image
                                    src={listingData.images[0] || '/placeholder.svg'}
                                    alt={listingData.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {listingData.images.slice(1, 5).map((image, index) => (
                                <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                                    <Image
                                        src={image || '/placeholder.svg'}
                                        alt={`${listingData.title} ${index + 2}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Title and Category */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge>{listingData.category}</Badge>
                            {listingData.subcategory && (
                                <Badge variant="outline">{listingData.subcategory}</Badge>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold">{listingData.title}</h2>
                        <p className="text-muted-foreground">{listingData.location}</p>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="glass-card p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Per Day</p>
                            <p className="text-2xl font-bold text-primary">
                                KSh {listingData.pricePerDay.toLocaleString()}
                            </p>
                        </div>
                        {listingData.pricePerWeek && (
                            <div className="glass-card p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Per Week</p>
                                <p className="text-2xl font-bold text-primary">
                                    KSh {listingData.pricePerWeek.toLocaleString()}
                                </p>
                            </div>
                        )}
                        {listingData.pricePerMonth && (
                            <div className="glass-card p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Per Month</p>
                                <p className="text-2xl font-bold text-primary">
                                    KSh {listingData.pricePerMonth.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {listingData.description}
                        </p>
                    </div>

                    {/* Features */}
                    {listingData.features && Object.keys(listingData.features).length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Features</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {Object.entries(listingData.features).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>{key}: {String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rental Terms */}
                    <div>
                        <h3 className="font-semibold mb-2">Rental Terms</h3>
                        <div className="space-y-2 text-sm">
                            {listingData.minRentalPeriod && (
                                <p>Minimum rental: {listingData.minRentalPeriod} day(s)</p>
                            )}
                            {listingData.maxRentalPeriod && (
                                <p>Maximum rental: {listingData.maxRentalPeriod} day(s)</p>
                            )}
                            {listingData.depositAmount && (
                                <p>Security deposit: KSh {listingData.depositAmount.toLocaleString()}</p>
                            )}
                        </div>
                    </div>

                    {/* Rental Policy */}
                    <div>
                        <h3 className="font-semibold mb-2">Rental Policy</h3>
                        <PolicyDisplay policyType={listingData.rentalPolicyType} showFull />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onEdit} className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Listing
                        </Button>
                        <Button onClick={onPublish} className="flex-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Publish Listing
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
