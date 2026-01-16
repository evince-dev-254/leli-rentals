import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { Phone, Mail, MapPin, MessageCircle, Send, Sparkles } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'expo-router';

const contactMethods = [
    {
        icon: MessageCircle,
        title: "WhatsApp",
        value: "+254785063461",
        description: "Quick responses, 9am - 9pm",
        action: "Chat Now",
        link: "https://wa.me/254785063461",
        color: "#10b981"
    },
    {
        icon: Mail,
        title: "Email",
        value: "support@gurucrafts.agency",
        description: "We reply within 24 hours",
        action: "Send Email",
        link: "mailto:support@gurucrafts.agency",
        color: "#3b82f6"
    },
    {
        icon: Phone,
        title: "Phone",
        value: "+254785063461",
        description: "Mon - Fri, 9am - 6pm",
        action: "Call Us",
        link: "tel:+254785063461",
        color: "#f59e0b"
    },
];

export default function ContactScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendMessage = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // In a real app, this would call an API
            alert('Success: Message sent! We will get back to you soon.');
            setName('');
            setEmail('');
            setMessage('');
        }, 1500);
    };

    return (
        <View className="flex-1 bg-[#fffdf0] dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center">
                    <BackButton />
                    <Text className="ml-4 text-xl font-black text-slate-900 dark:text-white">Get in Touch</Text>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        {/* Contact Methods */}
                        <View className="px-8 pt-6 mb-12">
                            <Text className="text-2xl font-black text-slate-900 dark:text-white mb-6">Support Channels</Text>
                            {contactMethods.map((method, idx) => (
                                <MotiView
                                    key={idx}
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ type: 'timing', duration: 500, delay: idx * 100 }}
                                    className="mb-4 bg-white/80 dark:bg-slate-900/80 p-5 rounded-[28px] border-2 border-slate-50 dark:border-slate-800 shadow-sm flex-row items-center"
                                >
                                    <View style={{ backgroundColor: `${method.color}15` }} className="h-12 w-12 rounded-2xl items-center justify-center mr-4">
                                        <method.icon size={22} color={method.color} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-sm font-black text-slate-900 dark:text-white">{method.title}</Text>
                                        <Text className="text-xs text-slate-500 font-bold">{method.description}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => Linking.openURL(method.link)}
                                        className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl"
                                    >
                                        <Text className="text-xs font-black text-blue-600">Connect</Text>
                                    </TouchableOpacity>
                                </MotiView>
                            ))}
                        </View>

                        {/* AI Assistant Promo */}
                        <View className="px-8 mb-12">
                            <View className="bg-blue-600 p-8 rounded-[40px] shadow-xl relative overflow-hidden">
                                <View className="relative z-10">
                                    <Sparkles size={32} color="white" className="mb-4" />
                                    <Text className="text-white text-2xl font-black mb-2">Leli AI Assistant</Text>
                                    <Text className="text-white/80 font-bold mb-6">Need instant help? Our AI is available 24/7 to answer your questions.</Text>
                                    <TouchableOpacity
                                        onPress={() => router.push('/support/ai-assistant')}
                                        className="bg-white px-8 py-3 rounded-full self-start shadow-sm"
                                    >
                                        <Text className="text-blue-600 font-black">Chat with AI</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/10 rounded-full" />
                            </View>
                        </View>

                        {/* Message Form */}
                        <View className="px-8 mb-32">
                            <Text className="text-2xl font-black text-slate-900 dark:text-white mb-6">Write to us</Text>
                            <View className="bg-white/90 dark:bg-slate-900/90 p-8 rounded-[40px] border-2 border-slate-50 dark:border-slate-800 shadow-sm">
                                <Input
                                    label="Full Name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChangeText={setName}
                                />
                                <Input
                                    label="Email Address"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <Input
                                    label="Message"
                                    placeholder="How can we help you?"
                                    value={message}
                                    onChangeText={setMessage}
                                    multiline
                                    numberOfLines={4}
                                    className="h-32 pt-4"
                                    containerClassName="mb-8"
                                />
                                <Button
                                    title="Send Message"
                                    onPress={handleSendMessage}
                                    loading={loading}
                                    icon={<Send size={18} color="white" />}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
