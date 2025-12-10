import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
    const plans = [
        {
            name: "Basic",
            price: "Free",
            description: "For casual renters and starters",
            features: [
                "Browse all listings",
                "Basic support",
                "Pay-per-rental insurance",
                "Community reviews"
            ],
            cta: "Get Started",
            popular: false
        },
        {
            name: "Pro",
            price: "KSh 2,500/mo",
            description: "For frequent renters and owners",
            features: [
                "Everything in Basic",
                "Reduced service fees",
                "Priority support",
                "Featured listings (for owners)",
                "Advanced analytics"
            ],
            cta: "Start Free Trial",
            popular: true
        },
        {
            name: "Business",
            price: "KSh 10,000/mo",
            description: "For rental businesses and fleets",
            features: [
                "Everything in Pro",
                "No service fees",
                "Dedicated account manager",
                "API access",
                "Custom branding"
            ],
            cta: "Contact Sales",
            popular: false
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-muted-foreground">
                            Choose the plan that fits your needs. No hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative rounded-2xl p-8 border ${plan.popular
                                        ? "border-primary bg-primary/5 shadow-xl"
                                        : "border-border bg-card shadow-sm"
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                    <div className="text-3xl font-bold mb-2">{plan.price}</div>
                                    <p className="text-muted-foreground">{plan.description}</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-primary shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className={`w-full ${plan.popular ? "bg-primary" : "bg-secondary text-secondary-foreground"}`}
                                    variant={plan.popular ? "default" : "outline"}
                                >
                                    {plan.cta}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
