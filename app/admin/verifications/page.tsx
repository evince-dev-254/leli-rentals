import { redirect } from 'next/navigation'
import { isAdmin, hasPermission, ADMIN_PERMISSIONS } from '@/lib/admin-auth'
import VerificationReviewPanel from '@/components/admin/verification-review-panel'

export default async function AdminVerificationsPage() {
  // Check if user is admin
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/unauthorized')
  }

  // Check if admin has permission to view verifications
  const canView = await hasPermission(ADMIN_PERMISSIONS.VIEW_VERIFICATIONS)
  
  if (!canView) {
    redirect('/unauthorized')
  }

  return <VerificationReviewPanel />
}

