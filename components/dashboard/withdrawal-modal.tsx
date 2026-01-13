"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { requestWithdrawal, MINIMUM_WITHDRAWAL } from "@/lib/actions/commission-actions"

interface WithdrawalModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    availableBalance: number
    userId: string
    onSuccess: () => void
    paymentInfo?: any
    role?: 'affiliate' | 'owner'
}

export function WithdrawalModal({
    open,
    onOpenChange,
    availableBalance,
    userId,
    onSuccess,
    paymentInfo,
    role = 'affiliate'
}: WithdrawalModalProps) {
    const [amount, setAmount] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const hasPaymentInfo = paymentInfo && Object.keys(paymentInfo).length > 0

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault()
        const amountVal = parseFloat(amount)

        if (isNaN(amountVal)) {
            toast.error("Invalid amount")
            return
        }

        if (amountVal < MINIMUM_WITHDRAWAL) {
            toast.error(`Minimum withdrawal is KSh ${MINIMUM_WITHDRAWAL.toLocaleString()}`)
            return
        }

        if (amountVal > 50000) {
            toast.error("Maximum withdrawal is KSh 50,000")
            return
        }

        if (amountVal > availableBalance) {
            toast.error("Insufficient balance")
            return
        }

        if (!hasPaymentInfo) {
            toast.error("Please add payment details in Settings first")
            return
        }

        setLoading(true)

        try {
            const result = await requestWithdrawal(
                userId,
                amountVal,
                paymentInfo.provider || 'mpesa',
                paymentInfo,
                role
            )

            if (result.success) {
                toast.success("Withdrawal request submitted!")
                onSuccess()
                onOpenChange(false)
                setAmount("")
            } else {
                toast.error("Failed to submit request", {
                    description: result.error
                })
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Request Payout</DialogTitle>
                    <DialogDescription>
                        Enter the amount you wish to withdraw to your linked payment account.
                    </DialogDescription>
                    <DialogDescription>
                        {hasPaymentInfo
                            ? `Funds will be sent to your saved ${paymentInfo.provider} account.`
                            : role === 'affiliate'
                                ? "Please add your payment details in the Settings tab to withdraw."
                                : "Please add your payment details in Settings > Payment to withdraw."
                        }
                    </DialogDescription>
                </DialogHeader>

                {!hasPaymentInfo ? (
                    <div className="py-6 text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                            You need to set up your payout details before you can withdraw funds.
                        </p>
                        <Button onClick={() => {
                            onOpenChange(false)
                            router.push('/dashboard/settings')
                        }}>
                            Go to Settings
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleWithdraw} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="balance" className="text-right">
                                Balance
                            </Label>
                            <div className="col-span-3 text-sm font-bold text-green-600">
                                Kes {availableBalance.toLocaleString()}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g. 1000"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">To</Label>
                            <div className="col-span-3 text-sm text-muted-foreground p-2 bg-muted rounded-md border">
                                <span className="font-semibold text-foreground uppercase">{paymentInfo.provider}</span>: {paymentInfo.account_number}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground pl-[25%]">
                            Min: KSh {MINIMUM_WITHDRAWAL.toLocaleString()} | Max: KSh 50,000
                        </p>
                    </form>
                )}

                {hasPaymentInfo && (
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={handleWithdraw} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Withdrawal
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
