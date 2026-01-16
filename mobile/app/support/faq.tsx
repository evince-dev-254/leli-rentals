import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, ChevronDown, ChevronUp, Package, CreditCard, Shield, Users, FileText, MessageCircle } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { cn } from '@/lib/utils';

const categories = [
    { icon: Package, label: "Rentals", count: 12 },
    { icon: CreditCard, label: "Payments", count: 8 },
    { icon: Shield, label: "Verification", count: 6 },
    { icon: Users, label: "Account", count: 10 },
    { icon: FileText, label: "Listings", count: 9 },
    { icon: MessageCircle, label: "Support", count: 5 },
];

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
                a: "Verification builds trust in our community. Owners must verify within 5 days of registration to ensure safe transactions.",
            },
            {
                q: "What documents do I need?",
                a: "You'll need a government-issued ID (National ID, Passport, or Driver's License). Business owners may also need to submit business registration documents.",
            },
        ],
    },
    {
        category: "Payments",
        questions: [
            {
                q: "What payment methods are accepted?",
                a: "We accept M-Pesa, card payments (Visa, Mastercard), and bank transfers through our secure Paystack integration.",
            },
            {
                q: "When do I get paid as an owner?",
                a: "Earnings are released 24 hours after the rental period ends. Payouts are processed within 2-3 business days.",
            },
        ],
    },
];

const FAQItem = ({ question, answer, isOpen, onToggle }: { question: string, answer: string, isOpen: boolean, onToggle: () => void }) => {
    return (
        <View className="mb-4 bg-white/80 dark:bg-slate-900/80 rounded-[24px] border border-slate-50 dark:border-slate-800 overflow-hidden shadow-sm">
            <TouchableOpacity
                onPress={onToggle}
                className="p-5 flex-row items-center justify-between"
            >
                <Text className="flex-1 text-sm font-black text-slate-900 dark:text-white pr-4">{question}</Text>
                {isOpen ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
            </TouchableOpacity>

            <AnimatePresence>
                {isOpen && (
                    <MotiView
                        from={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-5 pb-5"
                    >
                        <Text className="text-slate-500 dark:text-slate-400 font-bold leading-5">{answer}</Text>
                    </MotiView>
                )}
            </AnimatePresence>
        </View>
    );
};

export default function FAQScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredFaqs = faqs
        .filter(cat => !selectedCategory || cat.category === selectedCategory)
        .map(cat => ({
            ...cat,
            questions: cat.questions.filter(q =>
                q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }))
        .filter(cat => cat.questions.length > 0);

    return (
        <View className="flex-1 bg-[#fffdf0] dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <BackButton />
                        <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Help Hub</Text>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Search Section */}
                    <View className="px-8 pt-6 pb-8">
                        <View className="bg-white/90 dark:bg-slate-900/90 h-16 rounded-[24px] border-2 border-slate-50 dark:border-slate-800 flex-row items-center px-6 shadow-sm">
                            <Search size={20} color="#94a3b8" />
                            <TextInput
                                placeholder="Search for help..."
                                placeholderTextColor="#94a3b8"
                                className="flex-1 ml-3 text-slate-900 dark:text-white font-bold"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {/* Categories */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-8 mb-8">
                        {categories.map((cat, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => setSelectedCategory(selectedCategory === cat.label ? null : cat.label)}
                                className={cn(
                                    "mr-4 px-6 py-4 rounded-[28px] border-2 flex-row items-center shadow-sm",
                                    selectedCategory === cat.label
                                        ? "bg-blue-600 border-blue-600"
                                        : "bg-white/80 dark:bg-slate-900/80 border-slate-50 dark:border-slate-800"
                                )}
                            >
                                <cat.icon size={18} color={selectedCategory === cat.label ? "white" : "#3b82f6"} />
                                <Text className={cn(
                                    "ml-2 font-black text-xs",
                                    selectedCategory === cat.label ? "text-white" : "text-slate-900 dark:text-white"
                                )}>{cat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* FAQs */}
                    <View className="px-8 pb-32">
                        {filteredFaqs.length === 0 ? (
                            <View className="py-20 items-center">
                                <Text className="text-slate-400 font-bold">No results found for your search.</Text>
                            </View>
                        ) : (
                            filteredFaqs.map((cat, catIdx) => (
                                <View key={catIdx} className="mb-8">
                                    <Text className="text-lg font-black text-blue-600 mb-4">{cat.category}</Text>
                                    {cat.questions.map((faq, faqIdx) => (
                                        <FAQItem
                                            key={faqIdx}
                                            question={faq.q}
                                            answer={faq.a}
                                            isOpen={openIndex === `${catIdx}-${faqIdx}`}
                                            onToggle={() => setOpenIndex(prev => prev === `${catIdx}-${faqIdx}` ? null : `${catIdx}-${faqIdx}`)}
                                        />
                                    ))}
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
