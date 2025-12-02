"use client"

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    TrendingUp,
    Users,
    DollarSign,
    Award,
    Sparkles,
    CheckCircle,
    ArrowRight,
    Target,
    Zap,
    Gift
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const benefits = [
    {
        icon: DollarSign,
        title: "High Commission Rates",
        description: "Earn up to 15% commission on every successful referral"
    },
    {
        icon: Users,
        title: "Grow Your Network",
        description: "Build a sustainable income stream by expanding your referral network"
    },
    {
        icon: TrendingUp,
        title: "Performance Bonuses",
        description: "Unlock additional rewards as you hit monthly and quarterly targets"
    },
    {
        icon: Sparkles,
        title: "Marketing Tools",
        description: "Access exclusive promotional materials and tracking dashboards"
    },
    {
        icon: Award,
        title: "Recognition Program",
        description: "Top performers get featured and receive special perks"
    },
    {
        icon: Zap,
        title: "Instant Payouts",
        description: "Get paid quickly with our automated commission system"
    }
]

const commissionTiers = [
    {
        level: "Bronze",
        referrals: "1-10 referrals/month",
        commission: "10%",
        bonus: "None",
        color: "from-amber-600 to-amber-800"
    },
    {
        level: "Silver",
        referrals: "11-25 referrals/month",
        commission: "12%",
        bonus: "KSh 5,000",
        color: "from-gray-400 to-gray-600"
    },
    {
        level: "Gold",
        referrals: "26-50 referrals/month",
        commission: "15%",
        bonus: "KSh 15,000",
        color: "from-yellow-400 to-yellow-600",
        featured: true
    },
    {
        level: "Platinum",
        referrals: "50+ referrals/month",
        commission: "15% + Bonuses",
        bonus: "KSh 30,000+",
        color: "from-purple-400 to-purple-600"
    }
]

const faqs = [
    {
        question: "How do I become an affiliate?",
        answer: "Simply sign up on our platform, select 'Affiliate' as your account type, and you'll get instant access to your unique referral link and dashboard."
    },
    {
        question: "When do I get paid?",
        answer: "Commissions are paid out monthly, within 5 business days after the end of each month. You can track your earnings in real-time on your affiliate dashboard."
    },
    {
        question: "Is there a minimum payout threshold?",
        answer: "Yes, the minimum payout threshold is KSh 1,000. Once you reach this amount, your earnings will be automatically transferred to your registered account."
    },
    {
        question: "Can I refer both renters and owners?",
        answer: "Absolutely! You earn commissions when you refer both renters who make bookings and owners who list their items on the platform."
    }
]

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-950">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-blue-400/20 dark:from-purple-600/10 dark:via-pink-600/10 dark:to-blue-600/10" />
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] bg-purple-200/20 dark:bg-purple-400/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-pink-200/20 dark:bg-pink-400/10 rounded-full blur-3xl" />
                    </div>

                    <div className="container relative z-10 mx-auto px-4 max-w-6xl text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge className="mb-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-0">
                                <Gift className="h-3 w-3 mr-1" />
                                Join Our Affiliate Program
                            </Badge>
                            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Turn Your Network Into Income
                            </h1>
                            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                                Join Leli Rentals' affiliate program and earn generous commissions by referring renters and owners to our platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/get-started">
                                    <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-xl">
                                        Become an Affiliate
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="#how-it-works">
                                    <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-2 font-bold text-lg">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="text-center mb-12">
                            <h2 className="font-heading text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                Why Join Our Affiliate Program?
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Unlock exclusive benefits and grow your income with Leli Rentals
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="h-full hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit mb-4">
                                                <benefit.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <CardTitle>{benefit.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Commission Tiers */}
                <section id="how-it-works" className="py-20">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="text-center mb-12">
                            <h2 className="font-heading text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                Commission Structure
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                The more you refer, the more you earn. Climb the tiers and unlock higher commissions!
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {commissionTiers.map((tier, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className={`h-full ${tier.featured ? 'ring-2 ring-purple-500 shadow-xl' : ''}`}>
                                        <CardHeader>
                                            <div className={`h-2 w-full rounded-full bg-gradient-to-r ${tier.color} mb-4`} />
                                            <CardTitle className="text-2xl">{tier.level}</CardTitle>
                                            <CardDescription>{tier.referrals}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Commission Rate</p>
                                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{tier.commission}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Bonus</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{tier.bonus}</p>
                                            </div>
                                            {tier.featured && (
                                                <Badge className="w-full justify-center bg-purple-600 text-white">
                                                    Most Popular
                                                </Badge>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-12">
                            <h2 className="font-heading text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                How It Works
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                Start earning in 3 simple steps
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    step: "1",
                                    title: "Sign Up",
                                    description: "Create your affiliate account and get your unique referral link"
                                },
                                {
                                    step: "2",
                                    title: "Share & Promote",
                                    description: "Share your link with your network through social media, email, or your website"
                                },
                                {
                                    step: "3",
                                    title: "Earn Commissions",
                                    description: "Get paid for every successful referral that signs up and transacts"
                                }
                            ].map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQs */}
                <section className="py-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="text-center mb-12">
                            <h2 className="font-heading text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                Frequently Asked Questions
                            </h2>
                        </div>

                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="flex items-start gap-3">
                                            <CheckCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                                            {faq.question}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-400 ml-9">
                                            {faq.answer}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
                    <div className="container mx-auto px-4 max-w-4xl text-center text-white">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
                            Ready to Start Earning?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join thousands of affiliates already earning with Leli Rentals
                        </p>
                        <Link href="/get-started">
                            <Button size="lg" className="h-14 px-8 rounded-full bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg shadow-xl">
                                Get Started Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
