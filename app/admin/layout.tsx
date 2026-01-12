"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AdminSidebar, MobileAdminSidebar } from "@/components/admin/admin-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 pt-20 lg:pt-24">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 shadow-xl z-10">
          <AdminSidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-background">
          {/* Header */}
          <DashboardHeader
            mobileSidebar={<MobileAdminSidebar />}
            breadcrumbs={[
              { label: "Administration", href: "/admin" },
              { label: "Dashboard" }
            ]}
          />

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
            <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
