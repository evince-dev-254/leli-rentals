"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface DraftManagerProps {
    draftData: any
    onLoadDraft?: (data: any) => void
    autoSaveInterval?: number // in milliseconds
}

export function DraftManager({
    draftData,
    onLoadDraft,
    autoSaveInterval = 30000 // 30 seconds default
}: DraftManagerProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [hasDraft, setHasDraft] = useState(false)
    const { toast } = useToast()

    // Auto-save effect
    useEffect(() => {
        if (!draftData || Object.keys(draftData).length === 0) return

        const timer = setInterval(() => {
            saveDraft(true) // silent save
        }, autoSaveInterval)

        return () => clearInterval(timer)
    }, [draftData, autoSaveInterval])

    // Load draft on mount
    useEffect(() => {
        loadDraft()
    }, [])

    const saveDraft = async (silent = false) => {
        try {
            setIsSaving(true)

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { error } = await supabase
                .from('listing_drafts')
                .upsert({
                    owner_id: user.id,
                    draft_data: draftData,
                    last_saved_at: new Date().toISOString()
                }, {
                    onConflict: 'owner_id'
                })

            if (error) throw error

            setLastSaved(new Date())
            setHasDraft(true)

            if (!silent) {
                toast({
                    title: "Draft saved",
                    description: "Your listing has been saved as a draft.",
                })
            }
        } catch (error) {
            console.error('Error saving draft:', error)
            if (!silent) {
                toast({
                    title: "Error saving draft",
                    description: "Please try again.",
                    variant: "destructive"
                })
            }
        } finally {
            setIsSaving(false)
        }
    }

    const loadDraft = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('listing_drafts')
                .select('*')
                .eq('owner_id', user.id)
                .single()

            if (error) {
                if (error.code !== 'PGRST116') { // Not found error
                    throw error
                }
                return
            }

            if (data && onLoadDraft) {
                setHasDraft(true)
                setLastSaved(new Date(data.last_saved_at))
                onLoadDraft(data.draft_data)

                toast({
                    title: "Draft loaded",
                    description: "Your previous draft has been restored.",
                })
            }
        } catch (error) {
            console.error('Error loading draft:', error)
        }
    }

    const deleteDraft = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase
                .from('listing_drafts')
                .delete()
                .eq('owner_id', user.id)

            if (error) throw error

            setHasDraft(false)
            setLastSaved(null)

            toast({
                title: "Draft deleted",
                description: "Your draft has been removed.",
            })
        } catch (error) {
            console.error('Error deleting draft:', error)
            toast({
                title: "Error deleting draft",
                description: "Please try again.",
                variant: "destructive"
            })
        }
    }

    const getTimeSinceLastSave = () => {
        if (!lastSaved) return null

        const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000)

        if (seconds < 60) return `${seconds}s ago`
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        return `${Math.floor(seconds / 3600)}h ago`
    }

    return (
        <div className="flex items-center gap-3 flex-wrap">
            {/* Auto-save indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isSaving ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                    </>
                ) : lastSaved ? (
                    <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Saved {getTimeSinceLastSave()}</span>
                    </>
                ) : (
                    <>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span>Not saved</span>
                    </>
                )}
            </div>

            {/* Manual save button */}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => saveDraft(false)}
                disabled={isSaving}
            >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
            </Button>

            {/* Draft status badge */}
            {hasDraft && (
                <Badge variant="secondary">
                    Draft Available
                </Badge>
            )}
        </div>
    )
}
