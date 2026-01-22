import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
    X, Heart, MessageCircle, Bell, Shield,
    RefreshCw, HelpCircle, Mail, FileText,
    Lock, ChevronRight, Settings, Info, Sparkles, LogOut,
    Receipt, Star, Crown, DollarSign, Users, HelpCircle as HelpHub
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '../../context/auth-context';

interface HamburgerMenuProps {
    visible: boolean;
    onClose: () => void;
    activeRole: 'renter' | 'owner' | 'affiliate';
}

export function HamburgerMenu({ visible, onClose, activeRole }: HamburgerMenuProps) {
    const router = useRouter();
    const { signOut } = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handleSignOut = async () => {
        try {
            onClose();
            await signOut();
            router.replace('/auth/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const menuGroups = [
        {
            title: "Quick Access",
            items: [
                { icon: Heart, label: 'Saved Items', color: '#ec4899', href: '/favorites', roles: ['renter'] },
                { icon: MessageCircle, label: 'Messages', color: '#10b981', href: '/messages', roles: ['renter', 'owner', 'affiliate'] },
                { icon: Bell, label: 'Notifications', color: '#f59e0b', href: '/notifications', roles: ['renter', 'owner', 'affiliate'] },
                { icon: Sparkles, label: 'AI Assistant', color: '#8b5cf6', href: '/support/ai-assistant', roles: ['renter', 'owner', 'affiliate'] },
                { icon: Users, label: 'Affiliate Program', color: '#a855f7', href: '/affiliate', roles: ['renter', 'owner'] },
                { icon: Crown, label: 'Become an Owner', color: '#f97316', href: '/dashboard/verification', roles: ['renter'] },
                { icon: Settings, label: 'Asset Manager', color: '#3b82f6', href: '/listings/manage', roles: ['owner'] },
                { icon: Receipt, label: 'Payments', color: '#3b82f6', href: '/payments', roles: ['renter'] },
                { icon: Star, label: 'My Reviews', color: '#f59e0b', href: '/reviews', roles: ['renter', 'owner'] },
                { icon: Crown, label: 'Subscription', color: '#8b5cf6', href: '/subscription', roles: ['owner'] },
                { icon: Info, label: 'Partner Portal', color: '#a855f7', href: '/affiliate', roles: ['affiliate'] },
            ].filter(item => item.roles.includes(activeRole))
        },
        {
            title: "Support & Security",
            items: [
                { icon: HelpHub, label: 'Help Center', color: '#6366f1', href: '/support/faq' },
                { icon: DollarSign, label: 'Pricing Plans', color: '#10b981', href: '/support/pricing' },
                { icon: Shield, label: 'Security Portal', color: '#3b82f6', href: '/profile/security' },
                { icon: Mail, label: 'Contact Us', color: '#f97316', href: '/support/contact' },
            ]
        },
        {
            title: "Resource Hub",
            items: [
                { icon: Info, label: 'About Leli Rentals', color: '#94a3b8', href: '/support/about' },
                { icon: RefreshCw, label: 'Check Updates', color: '#64748b', href: '/settings/updates' },
            ]
        },
        {
            title: "Legal",
            items: [
                { icon: FileText, label: 'Terms of Service', color: '#64748b', href: '/legal/terms' },
                { icon: Lock, label: 'Privacy Policy', color: '#64748b', href: '/legal/privacy' },
                { icon: FileText, label: 'Cookie Policy', color: '#64748b', href: '/legal/cookies' },
            ]
        }
    ];

    const handleNavigate = (href: string) => {
        onClose();
        router.push(href as any);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View className="flex-1">
                <Pressable className="absolute inset-0 bg-slate-900/40" onPress={onClose} />

                <AnimatePresence>
                    {visible && (
                        <MotiView
                            from={{ translateX: -300 }}
                            animate={{ translateX: 0 }}
                            exit={{ translateX: -300 }}
                            transition={{ type: 'timing', duration: 300 }}
                            className="w-4/5 h-full bg-white dark:bg-slate-950 shadow-2xl"
                        >
                            <SafeAreaView className="flex-1" edges={['top', 'left', 'bottom']}>
                                {/* Header */}
                                <View className="px-6 pt-10 pb-6 border-b border-slate-50 dark:border-slate-900 flex-row items-center justify-between">
                                    <View>
                                        <Image
                                            source={isDark ? require('../../assets/images/logo_white.png') : require('../../assets/images/logo_black.png')}
                                            className="w-32 h-8 mb-1"
                                            resizeMode="contain"
                                            alt="Leli Rentals"
                                        />
                                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Links</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={onClose}
                                        className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900"
                                    >
                                        <X size={20} color={isDark ? "#ffffff" : "#0f172a"} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>

                                    {/* Switch Account Section */}
                                    <View className="mb-8">
                                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">
                                            Profile
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => handleNavigate('/auth/select-role')}
                                            className="flex-row items-center p-4 mb-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-transparent active:border-slate-100 dark:active:border-slate-800"
                                        >
                                            <View className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 items-center justify-center shadow-sm mr-4">
                                                <RefreshCw size={18} color="#3b82f6" />
                                            </View>
                                            <Text className="flex-1 text-sm font-black text-slate-700 dark:text-slate-300">
                                                Switch Account Role
                                            </Text>
                                            <ChevronRight size={16} color="#94a3b8" />
                                        </TouchableOpacity>
                                    </View>

                                    {menuGroups.map((group, gIdx) => (
                                        <View key={gIdx} className="mb-8">
                                            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">
                                                {group.title}
                                            </Text>

                                            {group.items.map((item, iIdx) => (
                                                <TouchableOpacity
                                                    key={iIdx}
                                                    onPress={() => handleNavigate(item.href)}
                                                    className="flex-row items-center p-4 mb-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-transparent active:border-slate-100 dark:active:border-slate-800"
                                                >
                                                    <View className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 items-center justify-center shadow-sm mr-4">
                                                        <item.icon size={18} color={item.color} />
                                                    </View>
                                                    <Text className="flex-1 text-sm font-black text-slate-700 dark:text-slate-300">
                                                        {item.label}
                                                    </Text>
                                                    <ChevronRight size={16} color="#94a3b8" />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ))}

                                    <View className="h-20" />
                                </ScrollView>

                                {/* Footer */}
                                <View className="p-6 border-t border-slate-50 dark:border-slate-900">
                                    <TouchableOpacity
                                        onPress={handleSignOut}
                                        className="flex-row items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 mb-6"
                                    >
                                        <View className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 items-center justify-center shadow-sm mr-4">
                                            <LogOut size={18} color="#ef4444" />
                                        </View>
                                        <Text className="flex-1 text-sm font-black text-red-600 dark:text-red-400">
                                            Sign Out
                                        </Text>
                                    </TouchableOpacity>

                                    <Text className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Leli Rentals v1.0.2
                                    </Text>
                                </View>
                            </SafeAreaView>
                        </MotiView>
                    )}
                </AnimatePresence>
            </View>
        </Modal>
    );
}
