"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { getAvailableBalance, requestWithdrawal } from "@/lib/actions/commission-actions"
import { MINIMUM_WITHDRAWAL } from "@/lib/constants"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface WithdrawalRequestProps {
    userType: 'owner' | 'affiliate'
}

export function WithdrawalRequest({ userType }: WithdrawalRequestProps) {
    const [balance, setBalance] = useState(0)
    const [amount, setAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank_transfer'>('mpesa')
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bankName, setBankName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [accountName, setAccountName] = useState("")
    const [loading, setLoading] = useState(false)
    const [loadingBalance, setLoadingBalance] = useState(true)

    useEffect(() => {
        loadBalance()
    }, [loadBalance])

    const loadBalance = useCallback(async () => {
        setLoadingBalance(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const result = await getAvailableBalance(user.id, userType)
            if (result.success) {
                setBalance(result.balance)
            }
        } catch (error) {
            console.error('Load balance error:', error)
        } finally {
            setLoadingBalance(false)
        }
    }, [userType])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error("Please sign in to request withdrawal")
                return
            }

            const withdrawalAmount = parseFloat(amount)

            if (isNaN(withdrawalAmount) || withdrawalAmount < MINIMUM_WITHDRAWAL) {
                toast.error(`Minimum withdrawal is KSh ${MINIMUM_WITHDRAWAL.toLocaleString()}`)
                return
            }

            if (withdrawalAmount > balance) {
                toast.error("Insufficient balance")
                return
            }

            const paymentDetails = paymentMethod === 'mpesa'
                ? { phone_number: phoneNumber }
                : {
                    bank_name: bankName,
                    account_number: accountNumber,
                    account_name: accountName
                }

            const result = await requestWithdrawal(
                user.id,
                userType,
                withdrawalAmount,
                paymentMethod,
                paymentDetails
            )

            if (result.success) {
                toast.success("Withdrawal request submitted successfully")
                setAmount("")
                setPhoneNumber("")
                setBankName("")
                setAccountNumber("")
                setAccountName("")
                loadBalance()
            } else {
                toast.error(result.error || "Failed to submit withdrawal request")
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const canWithdraw = balance >= MINIMUM_WITHDRAWAL

    return (
        <Card className="p-6">
            <div className="space-y-6">
                {/* Balance Display */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                            {loadingBalance ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                <p className="text-3xl font-bold">KSh {balance.toLocaleString()}</p>
                            )}
                        </div>
                        <Wallet className="h-12 w-12 text-green-500 opacity-50" />
                    </div>
                </div>

                {/* Minimum Withdrawal Notice */}
                <div className={`flex items-start gap-3 p-4 rounded-lg ${canWithdraw
                    ? 'bg-blue-500/10 border border-blue-500/20'
                    : 'bg-orange-500/10 border border-orange-500/20'
                    }`}>
                    {canWithdraw ? (
                        <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                    ) : (
                        <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                        <p className={`font-medium ${canWithdraw ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                            {canWithdraw
                                ? 'You can request a withdrawal'
                                : 'Minimum withdrawal not reached'}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Minimum withdrawal amount: KSh {MINIMUM_WITHDRAWAL.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Withdrawal Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="amount">Withdrawal Amount (KSh)</Label>
                        <Input
                            id="amount"
                            type="number"
                            min={MINIMUM_WITHDRAWAL}
                            max={balance}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`Min: ${MINIMUM_WITHDRAWAL.toLocaleString()}`}
                            className="mt-1.5"
                            disabled={!canWithdraw}
                        />
                    </div>

                    <div>
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Select
                            value={paymentMethod}
                            onValueChange={(v) => setPaymentMethod(v as 'mpesa' | 'bank_transfer')}
                            disabled={!canWithdraw}
                        >
                            <SelectTrigger className="mt-1.5">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mpesa">M-PESA</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {paymentMethod === 'mpesa' ? (
                        <div>
                            <Label htmlFor="phone">M-PESA Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+254712345678"
                                className="mt-1.5"
                                disabled={!canWithdraw}
                            />
                        </div>
                    ) : (
                        <>
                            <div>
                                <Label htmlFor="bank-name">Bank Name</Label>
                                <Input
                                    id="bank-name"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="e.g., Equity Bank"
                                    className="mt-1.5"
                                    disabled={!canWithdraw}
                                />
                            </div>
                            <div>
                                <Label htmlFor="account-number">Account Number</Label>
                                <Input
                                    id="account-number"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="Account number"
                                    className="mt-1.5"
                                    disabled={!canWithdraw}
                                />
                            </div>
                            <div>
                                <Label htmlFor="account-name">Account Name</Label>
                                <Input
                                    id="account-name"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    placeholder="Account holder name"
                                    className="mt-1.5"
                                    disabled={!canWithdraw}
                                />
                            </div>
                        </>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading || !canWithdraw}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Wallet className="mr-2 h-4 w-4" />
                                Request Withdrawal
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </Card>
    )
}
