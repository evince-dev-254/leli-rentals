"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

interface FAQItem {
    question: string
    answer: string
}

interface DashboardFAQProps {
    role: 'renter' | 'owner' | 'affiliate'
    className?: string
}

const FAQ_DATA = {
    renter: [
        {
            question: "How do I make a booking?",
            answer: "Simply browse our categories, select an item, choose your dates, and proceed to payment via Paystack. Your booking will be confirmed instantly."
        },
        {
            question: "Can I cancel a booking?",
            answer: "Cancellation policies are set by equipment owners. Check the listing details before booking. To request a cancellation, message the owner directly."
        },
        {
            question: "How do I contact the owner?",
            answer: "Once you've made a booking or even before, you can use the 'Message' button on the listing or your dashboard to chat with the owner."
        },
        {
            question: "Where do I see my payment history?",
            answer: "All your successful rental payments are listed under the 'Payments' tab in your Renter Dashboard."
        }
    ],
    owner: [
        {
            question: "How do I get paid?",
            answer: "Earnings from your rentals are credited to your Available Balance. You can request a payout once your balance reaches KSh 1,000."
        },
        {
            question: "When are funds cleared?",
            answer: "Funds usually move from pending to available once the rental period is successfully completed and no disputes are raised."
        },
        {
            question: "What are the service fees?",
            answer: "Leli Rentals charges a small service fee to maintain the platform and facilitate secure transactions. Details are shown during the booking process."
        },
        {
            question: "How do I manage my listings?",
            answer: "Use the 'Manage Listings' section in your Owner Dashboard to add new equipment, update prices, or change availability."
        }
    ],
    affiliate: [
        {
            question: "How do I earn commissions?",
            answer: "Share your unique referral link found in the Marketing tab. You'll earn a percentage of every successful booking made by users who sign up through your link."
        },
        {
            question: "What is the minimum withdrawal?",
            answer: "You can request a payout to your registered M-Pesa or bank account once your earnings reach a minimum of KSh 1,000."
        },
        {
            question: "How often are commissions calculated?",
            answer: "Commissions are calculated automatically as soon as a referred user's booking payment is successful."
        },
        {
            question: "Where do I track my referrals?",
            answer: "The 'Referrals' tab provides a detailed breakdown of everyone who signed up via your link and the status of their activities."
        }
    ]
}

export function DashboardFAQ({ role, className }: DashboardFAQProps) {
    const questions = FAQ_DATA[role] || []

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                    Quick answers to common questions for {role}s.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {questions.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-sm font-medium hover:no-underline">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}
