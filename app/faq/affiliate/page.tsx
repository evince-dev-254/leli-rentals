import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, HelpCircle, DollarSign, Settings, Mail } from "lucide-react";

export default function AffiliateFAQPage() {
    return (
        <div className="relative">
            {/* Hero Section with Video/Image Background */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Background Image (Ken Burns Effect) */}
                <div
                    className="absolute inset-0 bg-cover bg-center animate-ken-burns"
                    style={{
                        backgroundImage: `url('/kenyan-man-business.jpg')`,
                    }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/70" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <Button variant="ghost" size="sm" asChild className="mb-8 text-white/70 hover:text-white hover:bg-white/10">
                            <Link href="/dashboard/affiliate">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
                            Affiliate <span className="text-primary">Support Center</span>
                        </h1>
                        <p className="text-xl text-white/80 text-pretty leading-relaxed">
                            Everything you need to know about earning with Leli Rentals.
                            Find answers to common questions about commissions, payments, and your account.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <div className="bg-background">
                <div className="container mx-auto px-4 py-20 max-w-4xl space-y-20">

                    {/* General Section */}
                    <section id="general" className="space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <HelpCircle className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold">General Questions</h2>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <AccordionItem value="item-1" className="border rounded-2xl px-6 bg-card/50 backdrop-blur-sm">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                                    How does the Leli Rentals Affiliate Program work?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-6">
                                    Our program is simple: you sign up as an affiliate and get a unique referral link.
                                    Share this link on your social media, blog, or with friends.
                                    When someone clicks your link and makes a booking on Leli Rentals, you earn a commission.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-6" className="border rounded-2xl px-6 bg-card/50 backdrop-blur-sm">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                                    Do my referral cookies expire?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-6">
                                    Yes, our tracking cookies last for <span className="font-semibold text-foreground">30 days</span>.
                                    This means if a user clicks your link but only books 2 weeks later, you still get the commission!
                                    We use advanced tracking to ensure you get credit for every customer you bring.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* Earnings & Payments Section */}
                    <section id="payments" className="space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold">Earnings & Payments</h2>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <AccordionItem value="item-2" className="border rounded-2xl px-6 bg-card/50 backdrop-blur-sm">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                                    How much can I earn?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-6">
                                    You earn a <span className="font-semibold text-foreground">10% commission</span> on every successful booking made by users you refer.
                                    There is no cap on how much you can earn. The more you refer, the more you make!
                                    <br /><br />
                                    Example: If a user books a rental for KES 10,000, you earn KES 1,000 instantly.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="border rounded-2xl px-6 bg-card/50 backdrop-blur-sm">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                                    When and how do I get paid?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-6">
                                    You can request a withdrawal once your earnings reach the minimum threshold of <span className="font-semibold text-foreground">KES 100</span>.
                                    We process payments via:
                                    <ul className="list-disc pl-6 mt-2 space-y-1 text-base">
                                        <li><strong>Mobile Money (M-Pesa / Airtel Money)</strong> - Instant to 24 hours</li>
                                        <li><strong>Bank Transfer</strong> - 24 to 48 hours</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* Account Settings Section */}
                    <section id="account" className="space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Settings className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold">Account & Settings</h2>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <AccordionItem value="item-4" className="border rounded-2xl px-6 bg-card/50 backdrop-blur-sm">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                                    How do I set up my payment details?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-6">
                                    Go to your Affiliate Dashboard and click on the <strong>Settings</strong> tab.
                                    There you can enter your M-Pesa phone number or Bank Account details.
                                    The system will automatically detect your mobile provider.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* Contact CTA */}
                    <section className="pt-8">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600" />
                            <div className="relative p-12 md:p-16 text-center text-white space-y-8">
                                <div className="mx-auto bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center backdrop-blur-sm mb-6">
                                    <Mail className="h-10 w-10" />
                                </div>
                                <h2 className="text-4xl font-bold">Still have questions?</h2>
                                <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
                                    Our affiliate support team is available to help you maximize your earnings.
                                    Don&apos;t hesitate to reach out if you need assistance.
                                </p>
                                <Button size="lg" variant="secondary" asChild className="mt-4 font-bold text-lg h-14 px-10 bg-white text-primary hover:bg-white/90">
                                    <Link href="/contact">Contact Partner Support</Link>
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
