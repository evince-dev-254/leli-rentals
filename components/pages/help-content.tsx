"use client"

import { useState } from "react"
import { Search, MessageCircle, FileText, Shield, CreditCard, Package, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const categories = [
  { icon: Package, label: "Rentals", count: 12 },
  { icon: CreditCard, label: "Payments", count: 8 },
  { icon: Shield, label: "Verification", count: 6 },
  { icon: Users, label: "Account", count: 10 },
  { icon: FileText, label: "Listings", count: 9 },
  { icon: MessageCircle, label: "Support", count: 5 },
]

const faqs = [
  {
    category: "Rentals",
    questions: [
      {
        q: "How do I book a rental?",
        a: "Browse listings, select your dates, and click 'Book Now'. You'll be guided through the payment process. Once confirmed, you'll receive booking details via email.",
      },
      {
        q: "Can I cancel my booking?",
        a: "Yes, you can cancel bookings from your dashboard. Cancellation policies vary by owner - check the listing details for specific terms. Full refunds are typically available for cancellations made 48+ hours before the rental start.",
      },
      {
        q: "What if the item is damaged?",
        a: "Report any pre-existing damage to the owner before starting your rental. For damage during rental, contact support immediately. Security deposits may apply for certain items.",
      },
    ],
  },
  {
    category: "Verification",
    questions: [
      {
        q: "Why do I need to verify my account?",
        a: "Verification builds trust in our community. Owners must verify within 5 days of registration to ensure safe transactions. This includes submitting a valid ID and business documents if applicable.",
      },
      {
        q: "What documents do I need?",
        a: "You'll need a government-issued ID (National ID, Passport, or Driver's License). Business owners may also need to submit business registration documents and tax certificates.",
      },
      {
        q: "How long does verification take?",
        a: "Most verifications are completed within 24-48 hours. Complex cases may take up to 5 business days. You'll receive email updates on your verification status.",
      },
      {
        q: "What happens if I don't verify in time?",
        a: "Accounts that don't complete verification within 5 days will be temporarily suspended. You can still complete verification to reactivate your account.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept M-Pesa, card payments (Visa, Mastercard), and bank transfers through our secure Paystack integration. All payments are encrypted and secure.",
      },
      {
        q: "When do I get paid as an owner?",
        a: "Earnings are released 24 hours after the rental period ends. Payouts are processed within 2-3 business days to your linked M-Pesa or bank account.",
      },
      {
        q: "Are there any fees?",
        a: "Renters pay a small service fee (5-10%) added to the rental price. Owners receive 85% of the rental amount after platform fees. Exact fees are shown before checkout.",
      },
    ],
  },
  {
    category: "Subscriptions",
    questions: [
      {
        q: "What subscription plans are available?",
        a: "We offer two plans: Weekly (KSh 500 for up to 10 listings, 7 days) and Monthly (KSh 1,000 for unlimited listings, 30 days). Choose based on your listing volume.",
      },
      {
        q: "How do I upgrade my plan?",
        a: "Go to Dashboard > Subscription and select your preferred plan. You can upgrade anytime - we'll prorate the difference. Downgrades take effect at the next billing cycle.",
      },
      {
        q: "What happens when my subscription expires?",
        a: "Your listings will be hidden from search results. Renew your subscription from your dashboard to reactivate all listings immediately.",
      },
    ],
  },
]

export function HelpContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredFaqs = faqs
    .filter((cat) => !selectedCategory || cat.category === selectedCategory)
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.questions.length > 0)

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Help & <span className="text-primary">Support</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Find answers to common questions or get in touch with our support team.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                className="pl-12 h-14 text-lg bg-card/50 backdrop-blur-sm border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all hover:border-primary/50 ${selectedCategory === cat.label
                  ? "border-primary bg-primary/5"
                  : "bg-card/50 backdrop-blur-sm border-border/50"
                  }`}
                onClick={() => setSelectedCategory(selectedCategory === cat.label ? null : cat.label)}
              >
                <CardContent className="pt-6 text-center">
                  <cat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">{cat.label}</h3>
                  <p className="text-xs text-muted-foreground">{cat.count} articles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>

            {filteredFaqs.length === 0 ? (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No results found. Try a different search term.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredFaqs.map((category, catIndex) => (
                  <Card key={catIndex} className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} value={`${catIndex}-${faqIndex}`}>
                            <AccordionTrigger className="text-left hover:text-primary">{faq.q}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-border/50 max-w-3xl mx-auto">
            <CardContent className="py-12 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
              <p className="text-muted-foreground mb-6">Our support team is available 24/7 to assist you.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="https://wa.me/+254112081866" target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/contact">Contact Us</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
