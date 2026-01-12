"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AdminSidebar, MobileAdminSidebar } from "@/components/admin/admin-sidebar"
import { Header } from "@/components/layout/header"
import { Loader2 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.replace("/login")
          return
        }

        // Check role
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role, is_admin")
          .eq("id", user.id)
          .single()

        // Access allowed if role is 'admin' OR is_admin flag is true
        if (profile?.role !== "admin" && !profile?.is_admin) {
          // If not admin, verify where they should be.
          if (profile?.role === "owner") router.replace("/dashboard/owner")
          else if (profile?.role === "renter") router.replace("/dashboard/renter")
          else if (profile?.role === "affiliate") router.replace("/dashboard/affiliate")
          else router.replace("/")
        } else {
          setIsAdmin(true)
        }
      } catch (e) {
        console.error("Admin check failed", e)
        router.replace("/")
      } finally {
        setLoading(false)
      }
    }
    checkAdmin()
  }, [router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-20">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-[calc(100vh-80px)] overflow-hidden">
          <div className="lg:hidden p-4 pb-2 flex items-center gap-3">
            <MobileAdminSidebar />
            <span className="font-semibold text-lg">Admin Menu</span>
          </div>
          <main className="flex-1 p-6 gradient-mesh-admin overflow-x-hidden">{children}</main>
        </div>
      </div>
    </div>
  )
}
