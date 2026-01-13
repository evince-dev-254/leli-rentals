import { TestPayment } from "@/components/admin/test-payment"

export default function AdminTestPaymentPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Test Payment</h1>
                <p className="text-muted-foreground mt-2">
                    Test Paystack integration with a small payment
                </p>
            </div>

            <TestPayment />

            <div className="mt-8 max-w-md">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-sm">
                    <p className="font-semibold text-blue-600 dark:text-blue-400 mb-2">ℹ️ How it works:</p>
                    <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
                        <li>Enter your email and amount (default 1 KES)</li>
                        <li>Click "Pay" to open Paystack payment modal</li>
                        <li>Use the test card details provided</li>
                        <li>Complete the payment flow</li>
                        <li>Check the payment in <strong>Payments & Subscriptions</strong></li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
