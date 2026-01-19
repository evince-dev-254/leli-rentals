import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Send, User, Bot, ChevronLeft } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { useRouter } from 'expo-router';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function AIAssistantScreen() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm Leli, your personal gear assistant. How can I help you today? I can recommend equipment, explain rental terms, or help you list your own gear.",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const router = useRouter();

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const { GoogleGenerativeAI } = require("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `You are Leli, an intelligent and helpful AI assistant for Leli Rentals, a premium rental platform for equipment, cars, and homes in Mauritius. 
            
            Your personality is professional, friendly, and knowledgeable. You help users find gear, understand rental terms, and navigate the platform.
            
            User's message: ${input}
            
            Provide a helpful, concise response as Leli.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: text,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Gemini Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages, isTyping]);

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="px-8 py-4 flex-row items-center border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                    <BackButton />
                    <View className="ml-4 flex-row items-center">
                        <View className="h-10 w-10 rounded-2xl bg-blue-600 items-center justify-center mr-3 shadow-sm">
                            <Sparkles size={20} color="white" />
                        </View>
                        <View>
                            <Text className="text-lg font-black text-slate-900 dark:text-white">Leli AI</Text>
                            <View className="flex-row items-center">
                                <View className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
                                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Always Online</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 px-8 pt-6"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <MotiView
                                key={msg.id}
                                from={{ opacity: 0, translateY: 10, scale: 0.95 }}
                                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                                transition={{ type: 'timing', duration: 400 }}
                                className={`mb-6 flex-row ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'ai' && (
                                    <View className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900 items-center justify-center mr-3 self-end shadow-sm">
                                        <Bot size={16} color="#2563eb" />
                                    </View>
                                )}
                                <View
                                    className={`max-w-[80%] p-5 rounded-[28px] shadow-sm ${msg.sender === 'user'
                                        ? 'bg-blue-600 rounded-tr-none'
                                        : 'bg-white dark:bg-slate-900 rounded-tl-none border-2 border-slate-50 dark:border-slate-800'
                                        }`}
                                >
                                    <Text className={`text-base font-bold ${msg.sender === 'user' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                        {msg.text}
                                    </Text>
                                    <Text className={`text-[10px] mt-2 font-black uppercase tracking-tighter ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </View>
                                {msg.sender === 'user' && (
                                    <View className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-slate-700 items-center justify-center ml-3 self-end shadow-sm">
                                        <User size={16} color="#64748b" />
                                    </View>
                                )}
                            </MotiView>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <MotiView
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-row items-center mb-6 pl-11"
                        >
                            <View className="bg-white dark:bg-slate-900 p-4 rounded-full border-2 border-slate-50 dark:border-slate-800 shadow-sm flex-row gap-1">
                                <View className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                                <View className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                <View className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                            </View>
                        </MotiView>
                    )}
                </ScrollView>

                {/* Input Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                >
                    <View className="p-8 pb-10 bg-white/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
                        <View className="flex-row items-center bg-white dark:bg-slate-900 rounded-full border-2 border-slate-50 dark:border-slate-800 p-2 shadow-lg">
                            <TextInput
                                className="flex-1 px-6 py-4 text-base font-bold text-slate-900 dark:text-white"
                                placeholder="Type your message..."
                                placeholderTextColor="#94a3b8"
                                value={input}
                                onChangeText={setInput}
                                onSubmitEditing={handleSend}
                            />
                            <TouchableOpacity
                                onPress={handleSend}
                                className="h-12 w-12 rounded-full bg-blue-600 items-center justify-center shadow-md active:scale-95"
                            >
                                <Send size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-[10px] text-center mt-4 font-black text-slate-400 uppercase tracking-[0.2em]">Powered by Leli Intelligence</Text>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
