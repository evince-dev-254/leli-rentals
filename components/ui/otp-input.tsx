"use client"

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface OTPInputProps {
    length?: number
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    error?: boolean
}

export function OTPInput({
    length = 6,
    value,
    onChange,
    disabled = false,
    error = false
}: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(value ? value.split("") : Array(length).fill(""))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Sync internal state with value prop (allows parent to reset OTP)
    useEffect(() => {
        if (value === "") {
            setOtp(Array(length).fill(""))
        } else if (value && value.length === length) {
            setOtp(value.split(""))
        }
    }, [value, length])

    const handleChange = (index: number, digit: string) => {
        // Only allow digits
        if (digit && !/^\d$/.test(digit)) return

        const newOtp = [...otp]
        newOtp[index] = digit
        setOtp(newOtp)
        onChange(newOtp.join(""))

        // Auto-focus next input
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text/plain").slice(0, length)

        if (!/^\d+$/.test(pastedData)) return

        const newOtp = pastedData.split("").concat(Array(length).fill("")).slice(0, length)
        setOtp(newOtp)
        onChange(newOtp.join(""))

        // Focus last filled input
        const lastFilledIndex = Math.min(pastedData.length, length - 1)
        inputRefs.current[lastFilledIndex]?.focus()
    }

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length }).map((_, index) => (
                <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={cn(
                        "w-12 h-14 text-center text-2xl font-semibold",
                        error && "border-destructive focus-visible:ring-destructive"
                    )}
                    autoComplete="off"
                />
            ))}
        </div>
    )
}
