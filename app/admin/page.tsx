import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-auth'
import ComprehensiveAdminDashboard from '@/components/admin/comprehensive-admin-dashboard'

export default async function AdminPage() {
  // Check if user is admin
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/unauthorized')
  }

  return <ComprehensiveAdminDashboard />
}

