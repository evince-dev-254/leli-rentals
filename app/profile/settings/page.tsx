"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/profile")
  }, [router])

  return <LoadingSpinner message="Redirecting to profile..." />
}
