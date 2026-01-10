"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LeliBackIcon } from "@/components/icons/leli-back-icon"

interface BackButtonProps {
    className?: string
    href?: string
    label?: string
    onClick?: () => void
}

export function BackButton({ className, href, label = "Back", onClick }: BackButtonProps) {
    const router = useRouter()

    const handleBack = () => {
        if (onClick) {
            onClick()
            return
        }
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
            className={cn("gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors group", className)}
        >
            <div className="h-9 w-9 rounded-full bg-secondary/50 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 group-active:scale-90 shadow-sm border border-black/5 dark:border-white/5">
                <LeliBackIcon className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className={cn("font-semibold text-sm tracking-tight", !label && "sr-only")}>{label}</span>
        </Button>
    )
}
