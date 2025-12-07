"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { RENTAL_POLICIES, POLICY_COMPARISON, type RentalPolicyType } from "@/lib/constants/rental-policies"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

interface PolicySelectorProps {
    value: RentalPolicyType
    onChange: (value: RentalPolicyType) => void
    error?: string
}

export function PolicySelector({ value, onChange, error }: PolicySelectorProps) {
    const [showComparison, setShowComparison] = useState(false)

    const getIcon = (type: RentalPolicyType) => {
        switch (type) {
            case 'harsh':
                return <AlertTriangle className="h-5 w-5 text-red-500" />
            case 'strict':
                return <Shield className="h-5 w-5 text-orange-500" />
            case 'moderate':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />
        }
    }

    const getColorClass = (type: RentalPolicyType) => {
        switch (type) {
            case 'harsh':
                return 'border-red-500 bg-red-50 dark:bg-red-950/20'
            case 'strict':
                return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
            case 'moderate':
                return 'border-green-500 bg-green-50 dark:bg-green-950/20'
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <Label className="text-base font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Rental Policy
                    <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                    Choose how you want to handle theft, damage, and late returns. This policy will be clearly displayed to renters.
                </p>

                <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
                    {(Object.keys(RENTAL_POLICIES) as RentalPolicyType[]).map((type) => {
                        const policy = RENTAL_POLICIES[type]
                        const isSelected = value === type

                        return (
                            <label
                                key={type}
                                className={`block cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''
                                    }`}
                            >
                                <Card className={`${isSelected ? getColorClass(type) : ''} transition-all hover:shadow-md`}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem value={type} id={type} />
                                                {getIcon(type)}
                                                <div>
                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                        {policy.name}
                                                        {type === 'strict' && (
                                                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                                                {policy.badge}
                                                            </Badge>
                                                        )}
                                                        {type !== 'strict' && policy.badge && (
                                                            <Badge variant="outline">{policy.badge}</Badge>
                                                        )}
                                                    </CardTitle>
                                                    <CardDescription className="mt-1">
                                                        {policy.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="grid gap-2">
                                            <div className="flex items-start gap-2">
                                                <span className="font-semibold min-w-[100px]">Theft:</span>
                                                <span className="text-muted-foreground">{policy.theft.penalty}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="font-semibold min-w-[100px]">Damage:</span>
                                                <span className="text-muted-foreground">{policy.damage.fee}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="font-semibold min-w-[100px]">Late Return:</span>
                                                <span className="text-muted-foreground">
                                                    {policy.lateReturn.feeMultiplier}x daily rate (Grace: {policy.lateReturn.gracePeriod})
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </label>
                        )
                    })}
                </RadioGroup>

                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>

            {/* Policy Comparison Table */}
            <Collapsible open={showComparison} onOpenChange={setShowComparison}>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Info className="h-4 w-4" />
                    Compare all policies
                    <ChevronDown className={`h-4 w-4 transition-transform ${showComparison ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Policy Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 font-semibold">Feature</th>
                                            <th className="text-left py-2 font-semibold text-red-600 dark:text-red-400">Harsh</th>
                                            <th className="text-left py-2 font-semibold text-orange-600 dark:text-orange-400">Strict</th>
                                            <th className="text-left py-2 font-semibold text-green-600 dark:text-green-400">Moderate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {POLICY_COMPARISON.map((row, index) => (
                                            <tr key={index} className="border-b last:border-0">
                                                <td className="py-2 font-medium">{row.feature}</td>
                                                <td className="py-2 text-muted-foreground">{row.harsh}</td>
                                                <td className="py-2 text-muted-foreground">{row.strict}</td>
                                                <td className="py-2 text-muted-foreground">{row.moderate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Policy Enforcement</p>
                        <p className="text-blue-700 dark:text-blue-300">
                            Your chosen policy will be clearly displayed to renters before booking. While Leli Rentals facilitates communication and dispute resolution, you are responsible for enforcing your policy terms.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
