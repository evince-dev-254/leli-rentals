import type { LucideProps } from "lucide-react"

export function LeliBackIcon(props: LucideProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Branded Sharp Arrow Head */}
            <path d="m9 18-6-6 6-6" />

            {/* Main Key-Arrow Shaft */}
            <path d="M3 12h11" />

            {/* Geometric Key Teeth (Bits) - Sharp and Modern */}
            <path d="M7 12v3.5" />
            <path d="M10 12v2.5" />

            {/* circular Key Head (Handle) at the tail */}
            <circle cx="18" cy="12" r="4" strokeWidth="2.2" />
            <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" />

            {/* Connecting neck to head */}
            <path d="M14 12h1" opacity="0.8" />
        </svg>
    )
}
