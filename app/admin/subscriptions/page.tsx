import { SubscriptionsManagement } from "@/components/admin/subscriptions-management"

export default function AdminSubscriptionsPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Payments & Subscriptions</h1>
                <p className="text-muted-foreground mt-2">
                    Manage all payments and subscription plans across the platform
                </p>
            </div>

            <SubscriptionsManagement />
        </div>
    )
}
