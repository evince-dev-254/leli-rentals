"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { differenceInYears, parse, isValid } from 'date-fns'

interface DateOfBirthInputProps {
    value: string
    onChange: (value: string) => void
    error?: string
    minAge?: number
}

export function DateOfBirthInput({
    value,
    onChange,
    error,
    minAge = 18
}: DateOfBirthInputProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    const getAge = () => {
        if (!value) return null
        try {
            const date = new Date(value)
            if (!isValid(date)) return null
            return differenceInYears(new Date(), date)
        } catch {
            return null
        }
    }

    const age = getAge()

    return (
        <div className="space-y-2">
            <Label htmlFor="dob">
                Date of Birth <span className="text-destructive">*</span>
            </Label>
            <Input
                id="dob"
                type="date"
                value={value}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {age !== null && !error && (
                <p className="text-xs text-muted-foreground">
                    Age: {age} years old
                </p>
            )}
            <p className="text-xs text-muted-foreground">
                You must be at least {minAge} years old to register
            </p>
        </div>
    )
}

export function validateAge(dateOfBirth: string, minAge: number = 18): {
    valid: boolean
    error?: string
    age?: number
} {
    if (!dateOfBirth) {
        return { valid: false, error: 'Date of birth is required' }
    }

    try {
        const date = new Date(dateOfBirth)

        if (!isValid(date)) {
            return { valid: false, error: 'Please enter a valid date' }
        }

        if (date > new Date()) {
            return { valid: false, error: 'Date of birth cannot be in the future' }
        }

        const age = differenceInYears(new Date(), date)

        if (age < minAge) {
            return {
                valid: false,
                error: `You must be at least ${minAge} years old to register`,
                age
            }
        }

        return { valid: true, age }
    } catch {
        return { valid: false, error: 'Invalid date format' }
    }
}
