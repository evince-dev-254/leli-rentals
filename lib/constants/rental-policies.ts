// ============================================
// RENTAL POLICY DEFINITIONS
// ============================================
// Policy types and their specific rules

export type RentalPolicyType = 'harsh' | 'strict' | 'moderate'

export interface PolicyRules {
    name: string
    description: string
    color: string
    badge: string
    theft: {
        penalty: string
        action: string
        fee: string
    }
    damage: {
        assessment: string
        fee: string
        deposit: boolean
    }
    lateReturn: {
        feeMultiplier: number
        gracePeriod: string
        blacklistDays: number | null
    }
}

export const RENTAL_POLICIES: Record<RentalPolicyType, PolicyRules> = {
    harsh: {
        name: 'Harsh Policy',
        description: 'Strictest protection for high-value items. Maximum penalties for violations.',
        color: 'red',
        badge: 'Strict Protection',
        theft: {
            penalty: 'Full item value + 50% penalty',
            action: 'Immediate police report + legal action',
            fee: '150% of item value'
        },
        damage: {
            assessment: 'Professional assessment required',
            fee: 'Full repair/replacement cost + 30% handling fee',
            deposit: true
        },
        lateReturn: {
            feeMultiplier: 2.0,
            gracePeriod: 'None',
            blacklistDays: 3
        }
    },

    strict: {
        name: 'Strict Policy',
        description: 'Balanced protection with firm penalties. Recommended for most items.',
        color: 'orange',
        badge: 'Recommended',
        theft: {
            penalty: 'Full item value + 25% penalty',
            action: 'Police report required',
            fee: '125% of item value'
        },
        damage: {
            assessment: 'Photo evidence + repair quotes',
            fee: 'Full repair cost + 15% handling fee',
            deposit: true
        },
        lateReturn: {
            feeMultiplier: 1.5,
            gracePeriod: '1 hour',
            blacklistDays: null
        }
    },

    moderate: {
        name: 'Moderate Policy',
        description: 'Flexible terms with reasonable penalties. Good for building trust.',
        color: 'green',
        badge: 'Flexible',
        theft: {
            penalty: 'Full item value',
            action: 'Police report required',
            fee: '100% of item value'
        },
        damage: {
            assessment: 'Mutual agreement or independent assessment',
            fee: 'Actual repair cost (no markup)',
            deposit: false
        },
        lateReturn: {
            feeMultiplier: 1.0,
            gracePeriod: '2 hours',
            blacklistDays: null
        }
    }
}

// Helper function to get policy details
export function getPolicyDetails(policyType: RentalPolicyType): PolicyRules {
    return RENTAL_POLICIES[policyType]
}

// Helper function to calculate late return fee
export function calculateLateReturnFee(
    dailyRate: number,
    daysLate: number,
    policyType: RentalPolicyType
): number {
    const policy = RENTAL_POLICIES[policyType]
    return dailyRate * daysLate * policy.lateReturn.feeMultiplier
}

// Helper function to calculate theft penalty
export function calculateTheftPenalty(
    itemValue: number,
    policyType: RentalPolicyType
): number {
    const policy = RENTAL_POLICIES[policyType]
    const penaltyPercentage = policy.theft.fee.match(/(\d+)%/)?.[1]
    if (penaltyPercentage) {
        return itemValue * (parseInt(penaltyPercentage) / 100)
    }
    return itemValue
}

// Policy comparison data for UI
export const POLICY_COMPARISON = [
    {
        feature: 'Theft Penalty',
        harsh: '150% of value',
        strict: '125% of value',
        moderate: '100% of value'
    },
    {
        feature: 'Late Return Fee',
        harsh: '2x daily rate',
        strict: '1.5x daily rate',
        moderate: '1x daily rate'
    },
    {
        feature: 'Grace Period',
        harsh: 'None',
        strict: '1 hour',
        moderate: '2 hours'
    },
    {
        feature: 'Damage Deposit',
        harsh: 'Required',
        strict: 'Required',
        moderate: 'Optional'
    },
    {
        feature: 'Damage Fee',
        harsh: 'Cost + 30%',
        strict: 'Cost + 15%',
        moderate: 'Actual cost'
    }
]
