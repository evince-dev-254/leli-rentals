import { WithdrawalsManagement } from "@/components/admin/withdrawals-management"

export const metadata = {
    title: "Manage Withdrawals - Leli Admin",
    description: "Review and process payout requests",
}

export default function AdminWithdrawalsPage() {
    return <WithdrawalsManagement />
}
