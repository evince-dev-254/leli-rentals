import { PaystackSettings } from "@/components/admin/paystack-settings"

export default function AdminPaystackSettingsPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Paystack Configuration</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your Paystack API keys and webhook settings
                </p>
            </div>

            <PaystackSettings />
        </div>
    )
}
