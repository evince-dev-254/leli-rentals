"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
    Users,
    Building2,
    RefreshCcw,
    Loader2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function AccountTypeSwitcher() {
    const [role, setRole] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const getRole = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                setRole(data?.role || 'renter')
            }
        }
        getRole()
    }, [])

    const handleSwitch = async () => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const nextRole = role === 'owner' ? 'renter' : 'owner'

            const { error } = await supabase
                .from('user_profiles')
                .update({ role: nextRole })
                .eq('id', user.id)

            if (error) throw error

            setRole(nextRole)
            toast.success(`Switched to ${nextRole} account`)

            // Redirect based on new role
            if (nextRole === 'owner') {
                router.push('/dashboard/owner')
            } else {
                router.push('/categories')
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to switch account type")
        } finally {
            setLoading(false)
        }
    }

    if (!role || (role !== 'owner' && role !== 'renter')) return null

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSwitch}
            disabled={loading}
            className={cn(
                "gap-2 rounded-full px-4 h-9 shadow-sm transition-all duration-300",
                role === 'owner'
                    ? "border-blue-500/30 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/10 dark:text-blue-400"
                    : "border-purple-500/30 bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/10 dark:text-purple-400"
            )}
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : role === 'owner' ? (
                <Users className="h-4 w-4" />
            ) : (
                <Building2 className="h-4 w-4" />
            )}
            <span className="font-medium whitespace-nowrap">
                Switch to {role === 'owner' ? 'Renter' : 'Owner'}
            </span>
            <RefreshCcw className="h-3 w-3 opacity-50" />
        </Button>
    )
}
