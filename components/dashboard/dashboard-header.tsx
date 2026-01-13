"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AccountTypeSwitcher } from "./account-type-switcher"

interface DashboardHeaderProps {
  mobileSidebar: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export function DashboardHeader({ mobileSidebar, breadcrumbs }: DashboardHeaderProps) {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-20">
      {mobileSidebar}
      <div className="flex-1">
        {breadcrumbs && (
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground overflow-hidden">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.label} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground transition-colors truncate">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={index === breadcrumbs.length - 1 ? "font-semibold text-foreground truncate" : "truncate"}>
                    {crumb.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <AccountTypeSwitcher />
        {user && (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium truncate max-w-[150px]">
              {user.user_metadata?.full_name || user.email}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}
