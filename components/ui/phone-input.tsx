"use client"

import { Label } from '@/components/ui/label'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

interface PhoneNumberInputProps {
    value: string
    onChange: (value: string) => void
    label?: string
    error?: string
    required?: boolean
}

export function PhoneNumberInput({
    value,
    onChange,
    label = 'Phone Number',
    error,
    required = false
}: PhoneNumberInputProps) {

    const handleChange = (phoneValue: string | undefined) => {
        onChange(phoneValue || '')
    }

    const getFormattedNumber = () => {
        if (!value) return ''
        try {
            if (isValidPhoneNumber(value)) {
                const phoneNumber = parsePhoneNumber(value)
                return phoneNumber.formatInternational()
            }
        } catch (e) {
            // Invalid number, return as is
        }
        return value
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="phone">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <PhoneInput
                international
                defaultCountry="KE"
                value={value}
                onChange={handleChange}
                className={`flex h-10 w-full rounded-md border ${error ? 'border-destructive' : 'border-input'
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {value && isValidPhoneNumber(value) && (
                <p className="text-xs text-muted-foreground">
                    International format: {getFormattedNumber()}
                </p>
            )}
        </div>
    )
}

export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
    if (!phone) {
        return { valid: false, error: 'Phone number is required' }
    }

    if (!isValidPhoneNumber(phone)) {
        return { valid: false, error: 'Please enter a valid phone number' }
    }

    return { valid: true }
}
