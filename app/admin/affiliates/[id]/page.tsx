import { createClient } from "@/lib/supabase-server"
import { AffiliateDetailContent } from "@/components/admin/affiliate-detail-content"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Affiliate Details - Leli Admin",
    description: "View affiliate performance and referrals",
}

export default async function AffiliateDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    // Fetch user and affiliate data
    const { data: user } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', params.id)
        .single()

    const { data: affiliate } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', params.id)
        .maybeSingle()

    if (!user) {
        notFound()
    }

    return (
        <div className="container mx-auto py-8">
            <AffiliateDetailContent user={user} affiliate={affiliate} />
        </div>
    )
}
