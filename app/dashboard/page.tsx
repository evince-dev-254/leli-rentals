"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { LoadingLogo } from "@/components/ui/loading-logo"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push('/sign-in')
          return
        }

        setUser(user)

        // Fetch user profile from user_profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          if (profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError)
          }
          router.push('/select-role')
          return
        }

        setProfile(profileData)

        setProfile(profileData)

        // Redirect logic
        // If user is an admin, always use the dedicated admin area
        if (profileData.role === 'admin' || profileData.is_admin) {
          router.push('/admin')
          return
        }
        // Otherwise, send to specific role dashboard
        else if (profileData.role === 'renter') {
          router.push('/dashboard/renter')
        } else if (profileData.role === 'owner') {
          router.push('/dashboard/owner')
        } else if (profileData.role === 'affiliate') {
          router.push('/dashboard/affiliate')
        }

      } catch (error) {
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <LoadingLogo size={80} />
          <p className="mt-6 text-muted-foreground animate-pulse font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If redirecting, we might show a flash. Return null or loader.
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingLogo size={60} />
    </div>
  )
}
