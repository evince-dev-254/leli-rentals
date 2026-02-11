import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Crown, Zap, AlertCircle, ChevronRight, Star, ShieldCheck, Sparkles } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import BackButton from '../../components/ui/BackButton';

const StyledSafeAreaView = styled(SafeAreaView);

export default function SubscriptionScreen() {
    const { width } = useWindowDimensions();
    const plans = [
        {
            id: "weekly",
            name: "Basic Growth",
            price: 5,
            duration: "7 days",
            listingLimit: 5,
            features: ["5 Active Listings", "Standard Support", "Basic Analytics"],
            color: "#64748B",
            icon: Zap
        },
        {
            id: "monthly",
            name: "Owner Pro",
            price: 15,
            duration: "30 days",
            listingLimit: -1, // Unlimited
            features: ["Unlimited Listings", "Priority Support", "Advanced Insights", "Featured Tags"],
            color: "#F97316",
            popular: true,
            icon: Crown
        },
    ];

    return (
        <View className="flex-1">
            <ScreenBackground />
            <StyledSafeAreaView className="flex-1">
                <View className="px-6 pt-4">
                    <BackButton label="Subscription Plans" />
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    <View className="mb-8">
                        <View className="flex-row items-center mb-2">
                            <Sparkles size={18} color="#F97316" />
                            <Text className="ml-2 text-orange-600 font-outfit-bold text-xs uppercase tracking-widest">Premium for Owners</Text>
                        </View>
                        <Text className="text-3xl font-outfit-bold text-slate-900 leading-tight">Scale your rental business</Text>
                        <Text className="text-slate-500 font-outfit mt-2 text-base">Choose a plan that fits your growth ambitions.</Text>
                    </View>

                    {plans.map((plan) => (
                        <View key={plan.id} className={`mb-6 rounded-[40px] overflow-hidden border ${plan.popular ? 'border-orange-500/20 bg-white shadow-xl shadow-orange-100' : 'border-slate-100 bg-white/60 shadow-sm'}`}>
                            {plan.popular && (
                                <View className="bg-orange-500 py-2.5 items-center flex-row justify-center">
                                    <Star size={12} color="white" fill="white" />
                                    <Text className="text-white text-[10px] font-outfit-bold uppercase tracking-widest ml-2">Recommended for Professionals</Text>
                                </View>
                            )}
                            <View className="p-8">
                                <View className="flex-row justify-between items-start mb-6">
                                    <View className={`w-14 h-14 rounded-2xl items-center justify-center ${plan.popular ? 'bg-orange-50' : 'bg-slate-50'}`}>
                                        <plan.icon size={28} color={plan.color} strokeWidth={2.5} />
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-4xl font-outfit-bold text-slate-900">${plan.price}</Text>
                                        <Text className="text-slate-400 text-xs font-outfit">per {plan.duration}</Text>
                                    </View>
                                </View>

                                <Text className="text-2xl font-outfit-bold text-slate-900 mb-2">{plan.name}</Text>
                                <View className="bg-slate-50 rounded-full py-1 px-3 self-start mb-6">
                                    <Text className="text-slate-500 text-xs font-outfit-medium">{plan.id === 'monthly' ? 'Best value for active owners' : 'Perfect for new starters'}</Text>
                                </View>

                                <View className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <View key={idx} className="flex-row items-center">
                                            <View className={`w-5 h-5 rounded-full items-center justify-center ${plan.popular ? 'bg-orange-100' : 'bg-slate-100'}`}>
                                                <Check size={12} color={plan.popular ? '#F97316' : '#64748B'} strokeWidth={3} />
                                            </View>
                                            <Text className="ml-3 text-slate-700 font-outfit-medium text-sm">{feature}</Text>
                                        </View>
                                    ))}
                                </View>

                                <TouchableOpacity
                                    className={`py-5 rounded-3xl items-center shadow-lg ${plan.popular ? 'bg-orange-500 shadow-orange-200' : 'bg-slate-900 shadow-slate-200'}`}
                                >
                                    <Text className="text-white font-outfit-bold text-lg">Select {plan.name}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <View className="bg-slate-900 p-8 rounded-[40px] mb-10 overflow-hidden relative">
                        <View className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                        <View className="flex-row items-center mb-4">
                            <View className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center">
                                <ShieldCheck size={20} color="white" />
                            </View>
                            <Text className="ml-3 text-white font-outfit-bold text-lg">Secure Billing</Text>
                        </View>
                        <Text className="text-slate-300 font-outfit text-sm leading-relaxed mb-4">
                            All transactions are encrypted and processed via Paystack. Your plan can be managed directly from your profile settings.
                        </Text>
                        <TouchableOpacity className="flex-row items-center">
                            <Text className="text-orange-400 font-outfit-bold mr-2">Learn about our security</Text>
                            <ChevronRight size={14} color="#F97316" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </StyledSafeAreaView>
        </View>
    );
}
