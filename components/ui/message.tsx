"use client"

import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type MessageType = 'success' | 'error' | 'warning' | 'info'

interface MessageProps {
    type: MessageType
    title?: string
    message: string
    className?: string
}

const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
}

const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-destructive/10 border-destructive/20 text-destructive',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
}

export function Message({ type, title, message, className }: MessageProps) {
    const Icon = icons[type]

    return (
        <div className={cn(
            'rounded-lg border p-4 flex gap-3',
            styles[type],
            className
        )}>
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                {title && <p className="font-semibold mb-1">{title}</p>}
                <p className="text-sm">{message}</p>
            </div>
        </div>
    )
}

// Toast-style notification component
export function Toast({ type, title, message, onClose }: MessageProps & { onClose?: () => void }) {
    const Icon = icons[type]

    return (
        <div className={cn(
            'fixed top-4 right-4 z-50 rounded-lg border p-4 flex gap-3 shadow-lg max-w-md animate-in slide-in-from-top-2',
            styles[type]
        )}>
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                {title && <p className="font-semibold mb-1">{title}</p>}
                <p className="text-sm">{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-current hover:opacity-70 transition-opacity"
                >
                    <XCircle className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}
