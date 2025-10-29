import { redirect } from 'next/navigation'
import { isAdmin, getAdminUser } from '@/lib/admin-auth'
import AdminDashboard from '@/components/admin/admin-dashboard'

export default async function AdminPage() {
  // Check if user is admin
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/unauthorized')
  }

  const adminUser = await getAdminUser()

  return <AdminDashboard adminUser={adminUser!} />
}

