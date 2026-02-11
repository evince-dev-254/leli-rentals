import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { HelpCircle, MessageSquare, Phone, Mail, ChevronRight, Search, FileText, Send } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useNotifications } from '../../context/NotificationContext';

const SafeAreaView = styled(SafeAreaViewContext);

export default function SupportScreen() {
    const { addNotification } = useNotifications();
    const FAQS = [
        "How do I book a rental?",
        "What are the payment methods?",
        "Can I cancel my subscription?",
        "How to contact a property owner?",
    ];

    const handleFAQPress = (faq: string) => {
        addNotification({
            title: 'Support Inquiry',
            description: `Loading details for: ${faq}`,
            type: 'info',
            iconName: 'Info',
        });
    };

    const handleContactPress = (method: string) => {
        addNotification({
            title: 'Contact Support',
            description: `Redirecting to Support ${method}...`,
            type: 'success',
            iconName: 'Bell',
        });
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-6 pt-4">
                <ScreenHeader title="Help & Support" />

                <ScrollView showsVerticalScrollIndicator={false} className="mt-6">
                    {/* Search FAQ */}
                    <View className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 mb-8 flex-row items-center shadow-sm">
                        <Search size={20} color="#94A3B8" />
                        <TextInput
                            placeholder="Search help topics..."
                            className="flex-1 ml-3 font-outfit text-slate-800"
                            onSubmitEditing={(e) => {
                                addNotification({
                                    title: 'Help Search',
                                    description: `Searching for help on "${e.nativeEvent.text}"`,
                                    type: 'info',
                                    iconName: 'Search',
                                });
                            }}
                        />
                    </View>

                    <Text className="text-xs font-outfit-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Top Questions</Text>
                    <View className="bg-white/80 rounded-3xl p-2 border border-white shadow-sm mb-8">
                        {FAQS.map((faq, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleFAQPress(faq)}
                                className="flex-row items-center py-4 px-2 border-b border-slate-50"
                            >
                                <HelpCircle size={18} color="#94A3B8" className="mr-3" />
                                <Text className="flex-1 font-outfit-medium text-slate-700">{faq}</Text>
                                <ChevronRight size={16} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text className="text-xs font-outfit-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Contact Us</Text>
                    <View className="flex-row justify-between mb-10">
                        <TouchableOpacity
                            onPress={() => handleContactPress('Email')}
                            className="bg-white border border-slate-100 p-5 rounded-3xl items-center flex-1 mr-2 shadow-sm"
                        >
                            <View className="w-12 h-12 bg-orange-50 rounded-2xl items-center justify-center mb-3">
                                <Mail size={24} color="#F97316" />
                            </View>
                            <Text className="font-outfit-bold text-slate-800">Email</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleContactPress('Chat')}
                            className="bg-white border border-slate-100 p-5 rounded-3xl items-center flex-1 ml-2 shadow-sm"
                        >
                            <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center mb-3">
                                <MessageSquare size={24} color="#64748B" />
                            </View>
                            <Text className="font-outfit-bold text-slate-800">Chat</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
