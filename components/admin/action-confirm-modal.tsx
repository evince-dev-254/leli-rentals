"use client"

import React from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ActionConfirmModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive" | "warning"
    loading?: boolean
}

export function ActionConfirmModal({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    loading = false,
}: ActionConfirmModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="glass-card border-none max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground pt-2">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="pt-4">
                    <AlertDialogCancel asChild>
                        <Button variant="ghost" disabled={loading}>
                            {cancelText}
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant={variant === "destructive" ? "destructive" : variant === "warning" ? "default" : "default"}
                            className={variant === "warning" ? "bg-orange-600 hover:bg-orange-700" : ""}
                            onClick={(e) => {
                                e.preventDefault()
                                onConfirm()
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Processing...
                                </div>
                            ) : (
                                confirmText
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
