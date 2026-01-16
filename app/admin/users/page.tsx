import { Suspense } from "react"
import { UsersManagement } from "@/components/admin/users-management"

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center animate-pulse text-muted-foreground">Loading users manager...</div>}>
      <UsersManagement />
    </Suspense>
  )
}
