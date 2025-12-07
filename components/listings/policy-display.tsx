"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, CheckCircle2, Clock, Wrench, Ban } from "lucide-react"
import { RENTAL_POLICIES, type RentalPolicyType } from "@/lib/constants/rental-policies"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface PolicyDisplayProps {
    policyType: RentalPolicyType
    showFull?: boolean
    className?: string
}

export function PolicyDisplay({ policyType, showFull = false, className = "" }: PolicyDisplayProps) {
    const [isOpen, setIsOpen] = useState(showFull)
    const policy = RENTAL_POLICIES[policyType]

    const getBadgeVariant = () => {
        switch (policyType) {
            case 'harsh':
                return 'destructive'
            case 'strict':
                return 'default'
            case 'moderate':
                return 'secondary'
        }
    }

    const getIcon = () => {
        switch (policyType) {
            case 'harsh':
                return <AlertTriangle className="h-4 w-4" />
            case 'strict':
                return <Shield className="h-4 w-4" />
            case 'moderate':
                return <CheckCircle2 className="h-4 w-4" />
        }
    }

    return (
        <div className={className}>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center justify-between gap-2">
                    <Badge variant={getBadgeVariant()} className="flex items-center gap-1">
                        {getIcon()}
                        {policy.name}
                    </Badge>
                    <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        View Policy
                        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Rental Policy Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Theft Policy */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-semibold text-sm">
                                    <Ban className="h-4 w-4 text-red-500" />
                                    Theft & Non-Return
                                </div>
                                <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                                    <p><strong>Penalty:</strong> {policy.theft.penalty}</p>
                                    <p><strong>Action:</strong> {policy.theft.action}</p>
                                </div>
                            </div>

                            {/* Damage Policy */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-semibold text-sm">
                                    <Wrench className="h-4 w-4 text-orange-500" />
                                    Damage Assessment
                                </div>
                                <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                                    <p><strong>Assessment:</strong> {policy.damage.assessment}</p>
                                    <p><strong>Fee:</strong> {policy.damage.fee}</p>
                                    <p><strong>Deposit:</strong> {policy.damage.deposit ? 'Required' : 'Not required'}</p>
                                </div>
                            </div>

                            {/* Late Return Policy */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-semibold text-sm">
                                    <Clock className="h-4 w-4 text-blue-500" />
                                    Late Returns
                                </div>
                                <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                                    <p><strong>Fee:</strong> {policy.lateReturn.feeMultiplier}x daily rental rate per day</p>
                                    <p><strong>Grace Period:</strong> {policy.lateReturn.gracePeriod}</p>
                                    {policy.lateReturn.blacklistDays && (
                                        <p className="text-destructive">
                                            <strong>Warning:</strong> Late returns over {policy.lateReturn.blacklistDays} days may result in account restrictions
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                                <p>
                                    By booking this item, you agree to this rental policy. All disputes will be handled according to our Terms of Service.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}

// Compact version for listing cards
export function PolicyBadge({ policyType }: { policyType: RentalPolicyType }) {
    const policy = RENTAL_POLICIES[policyType]

    const getIcon = () => {
        switch (policyType) {
            case 'harsh':
                return <AlertTriangle className="h-3 w-3" />
            case 'strict':
                return <Shield className="h-3 w-3" />
            case 'moderate':
                return <CheckCircle2 className="h-3 w-3" />
        }
    }

    const getBgColor = () => {
        switch (policyType) {
            case 'harsh':
                return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
            case 'strict':
                return 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'
            case 'moderate':
                return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300'
        }
    }

    return (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getBgColor()}`}>
            {getIcon()}
            {policy.name}
        </div>
    )
}
