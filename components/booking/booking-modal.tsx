"use client"

import { useState } from "react"
import { CreditCard, Check, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Listing } from "@/lib/listings-data"
import type { DateRange } from "react-day-picker"
import { createBooking } from "@/lib/actions/booking-actions"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface BookingModalProps {
  listing: Listing
  isOpen: boolean
  onClose: () => void
}

type BookingStep = "dates" | "details" | "payment" | "success"

export function BookingModal({ listing, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>("dates")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [rentalPeriod, setRentalPeriod] = useState<"daily" | "weekly" | "monthly">("daily")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  const calculateTotal = () => {
    if (!dateRange?.from || !dateRange?.to) return 0
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))

    if (rentalPeriod === "monthly" && days >= 30) {
      return Math.ceil(days / 30) * listing.pricePerMonth
    } else if (rentalPeriod === "weekly" && days >= 7) {
      return Math.ceil(days / 7) * listing.pricePerWeek
    }
    return days * listing.pricePerDay
  }

  const getDays = () => {
    if (!dateRange?.from || !dateRange?.to) return 0
    return Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handlePayWithPaystack = async () => {
    // 1. Initial auth check before anything else
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      toast.error("Please sign in to book this rental", {
        description: "You need to be logged in as a renter to proceed.",
        action: {
          label: "Sign In",
          onClick: () => window.location.href = "/sign-in"
        }
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate Paystack payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      const total = calculateTotal()

      // Create booking in DB (which sends email)
      const result = await createBooking({
        listing_id: listing.id,
        renter_id: user.id,
        owner_id: listing.ownerId || listing.id, // Fallback if ownerId missing in listing type
        start_date: dateRange!.from!.toISOString(),
        end_date: dateRange!.to!.toISOString(),
        total_days: getDays(),
        price_per_day: listing.pricePerDay,
        subtotal: total,
        service_fee: 0,
        total_amount: total,
        payment_status: 'paid', // Simulated
        status: 'confirmed'
      }, formData.email, formData.fullName, listing.title)

      if (!result.success) throw new Error(result.error)

      toast.success("Booking confirmed!", {
        description: `Your reservation for ${listing.title} has been successfully created.`
      })
      setStep("success")
    } catch (error: any) {
      console.error("Booking error:", error)
      const isAuthError = error.message?.includes("User not logged in") || error.message?.includes("unauthorized")

      if (isAuthError) {
        toast.error("Please sign in to book this rental", {
          description: "Your session may have expired. Please sign in again.",
          action: {
            label: "Sign In",
            onClick: () => window.location.href = "/sign-in"
          }
        })
      } else {
        toast.error("Booking Failed", {
          description: error.message || "Something went wrong while processing your booking. Please try again."
        })
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const resetAndClose = () => {
    setStep("dates")
    setDateRange(undefined)
    setFormData({ fullName: "", email: "", phone: "" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "dates" && "Select Dates"}
            {step === "details" && "Your Details"}
            {step === "payment" && "Payment"}
            {step === "success" && "Booking Confirmed!"}
          </DialogTitle>
          <DialogDescription>
            {step === "dates" && `Book ${listing.title}`}
            {step === "details" && "Please provide your contact information"}
            {step === "payment" && "Complete your payment securely with Paystack"}
            {step === "success" && "Your booking has been confirmed"}
          </DialogDescription>
        </DialogHeader>

        {step === "dates" && (
          <div className="space-y-4">
            {/* Listing Preview */}
            <div className="flex gap-3 p-3 bg-secondary/50 rounded-lg">
              <div className="relative w-20 h-16 rounded overflow-hidden">
                <Image
                  src={listing.images[0] || "/placeholder.svg"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-sm">{listing.title}</p>
                <p className="text-xs text-muted-foreground">{listing.location}</p>
              </div>
            </div>

            {/* Rental Period Selection */}
            <div>
              <Label className="mb-2 block">Rental Period</Label>
              <RadioGroup
                value={rentalPeriod}
                onValueChange={(v) => setRentalPeriod(v as typeof rentalPeriod)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="text-sm">
                    Daily (KSh {listing.pricePerDay.toLocaleString()})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly" className="text-sm">
                    Weekly (KSh {listing.pricePerWeek.toLocaleString()})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly" className="text-sm">
                    Monthly (KSh {listing.pricePerMonth.toLocaleString()})
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Calendar */}
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              disabled={(date) => date < new Date()}
              className="rounded-md border mx-auto"
            />

            {dateRange?.from && dateRange?.to && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">{getDays()} days</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Total:</span>
                  <span className="font-bold text-primary">KSh {calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              disabled={!dateRange?.from || !dateRange?.to}
              onClick={() => setStep("details")}
            >
              Continue
            </Button>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+254 712 345 678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <Separator />

            {/* Booking Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Item:</span>
                <span>{listing.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dates:</span>
                <span>
                  {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>{getDays()} days</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">KSh {calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("dates")} className="flex-1">
                Back
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                disabled={!formData.fullName || !formData.email || !formData.phone}
                onClick={() => setStep("payment")}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            {/* Payment Summary */}
            <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Item:</span>
                <span className="font-medium">{listing.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span>{getDays()} days</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span className="text-primary">KSh {calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            {/* Paystack Payment */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-[#00C3F7]/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-[#00C3F7]" />
                </div>
                <div>
                  <p className="font-medium">Pay with Paystack</p>
                  <p className="text-xs text-muted-foreground">Secure payment processing</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                You will be redirected to Paystack to complete your payment securely. We accept cards, bank transfers,
                and mobile money.
              </p>
              <div className="relative h-6 w-32 opacity-50 dark:invert">
                <Image
                  src="https://website-v3-assets.s3.amazonaws.com/assets/img/hero/Paystack-mark-white-twitter.png"
                  alt="Paystack"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("details")} className="flex-1">
                Back
              </Button>
              <Button
                className="flex-1 bg-[#00C3F7] hover:bg-[#00A8D6] text-white"
                onClick={handlePayWithPaystack}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay KSh {calculateTotal().toLocaleString()}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-6">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground mb-4">
              Your booking for {listing.title} has been confirmed. A confirmation email has been sent to{" "}
              {formData.email}.
            </p>
            <div className="p-4 bg-secondary/50 rounded-lg text-left text-sm space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking Reference:</span>
                <span className="font-mono">LELI-{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dates:</span>
                <span>
                  {dateRange?.from?.toLocaleDateString()} - {dateRange?.to?.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-bold text-primary">KSh {calculateTotal().toLocaleString()}</span>
              </div>
            </div>
            <Button onClick={resetAndClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
