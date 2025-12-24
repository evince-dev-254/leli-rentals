"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BackButtonProps {
    className?: string
    href?: string
    label?: string
}

export function BackButton({ className, href, label = "Back" }: BackButtonProps) {
    const router = useRouter()

    const handleBack = () => {
        if (href) {
            router.push(href)
        } else {
            router.back()
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={cn("gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors", className)}
        >
            <div className="h-8 w-8 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ArrowLeft className="h-4 w-4" />
            </div>
            <span className={cn("font-medium", !label && "sr-only")}>{label}</span>
        </Button>
    )
}
