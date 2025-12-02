"use client"

import { ArrowLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
    title: string
    description?: string
    breadcrumbs?: { label: string; href?: string }[]
    showBackButton?: boolean
    actions?: React.ReactNode
    className?: string
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    showBackButton = false,
    actions,
    className
}: PageHeaderProps) {
    const router = useRouter()

    return (
        <div className={cn("mb-8", className)}>
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <button
                        onClick={() => router.push('/')}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                    >
                        <Home className="h-3.5 w-3.5" />
                        Home
                    </button>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span>/</span>
                            {crumb.href ? (
                                <button
                                    onClick={() => router.push(crumb.href!)}
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {crumb.label}
                                </button>
                            ) : (
                                <span className="text-gray-900 dark:text-gray-100">{crumb.label}</span>
                            )}
                        </div>
                    ))}
                </nav>
            )}

            {/* Header Content */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    {showBackButton && (
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="mb-4 -ml-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    )}

                    <h1 className="font-heading text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent mb-2">
                        {title}
                    </h1>

                    {description && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
                            {description}
                        </p>
                    )}
                </div>

                {/* Actions */}
                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}
