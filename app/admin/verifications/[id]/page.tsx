import { VerificationDetail } from "@/components/admin/verification-detail"

export default async function VerificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <VerificationDetail verificationId={id} />
}
