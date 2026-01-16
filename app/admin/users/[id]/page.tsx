import { createClient } from "@/lib/supabase-server"
import { UserDetailContent } from "@/components/admin/user-detail-content"
import { notFound } from "next/navigation"

export const metadata = {
    title: "User Details - Leli Admin",
    description: "View and manage user profile and activity",
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: user } = await supabase
        .from('user_profiles')
        .select(`
            *,
            referrer:referred_by(full_name)
        `)
        .eq('id', id)
        .single()

    if (!user) {
        notFound()
    }

    return (
        <div className="container mx-auto py-8">
            <UserDetailContent user={user} />
        </div>
    )
}
