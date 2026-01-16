import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/auth-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, Shield, Bell, HelpCircle, MessageCircle, ShoppingBag, Plus, Star, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const menuItems = [
        { icon: User, label: 'Edit Profile', color: '#3b82f6', href: '/profile/edit' },
        { icon: Shield, label: 'Security', color: '#10b981', href: '/profile/security' },
        { icon: Bell, label: 'Notifications', color: '#f59e0b', href: '/notifications' },
        { icon: RefreshCw, label: 'Software Updates', color: '#f97316', href: '/settings/updates' },
        { icon: HelpCircle, label: 'Help Hub', color: '#6366f1', href: '/support/faq' },
        { icon: MessageCircle, label: 'Contact Support', color: '#ec4899', href: '/support/contact' },
    ];

    const legalItems = [
        { label: 'Terms of Service', href: '/legal/terms' },
        { label: 'Privacy Policy', href: '/legal/privacy' },
    ];

    return (
        <View className="flex-1 bg-[#fffdf0] dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['bottom']}>
                <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                    <View className="h-12" /> {/* Custom top spacing */}
                    {/* Profile Header */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="items-center mb-10"
                    >
                        <View className="h-24 w-24 rounded-[32px] bg-orange-100 items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm overflow-hidden mb-4">
                            {user?.user_metadata?.avatar_url ? (
                                <Image source={{ uri: user.user_metadata.avatar_url }} className="h-full w-full" alt="Profile avatar" />
                            ) : (
                                <User size={40} color="#f97316" strokeWidth={1.5} />
                            )}
                        </View>
                        <Text className="text-2xl font-black text-slate-900 dark:text-white">
                            {user?.user_metadata?.full_name || 'Leli Member'}
                        </Text>
                        <View className="bg-[#f97316] px-4 py-1 rounded-full mt-2">
                            <Text className="text-[10px] font-black text-white uppercase tracking-widest">
                                {user?.user_metadata?.role || 'Renter'}
                            </Text>
                        </View>
                    </MotiView>

                    {/* Stats Summary */}
                    <View className="flex-row gap-4 mb-10">
                        {[
                            { label: 'Rentals', value: '12', icon: ShoppingBag, color: 'text-orange-600', bg: 'bg-orange-100' },
                            { label: 'Listings', value: '4', icon: Plus, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                            { label: 'Rating', value: '4.9', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100' },
                        ].map((stat, idx) => (
                            <View key={idx} className="flex-1 bg-white/60 dark:bg-slate-900/60 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 items-center">
                                <View className={`h-10 w-10 rounded-2xl ${stat.bg} items-center justify-center mb-2`}>
                                    <stat.icon size={18} color={stat.color === 'text-orange-600' ? '#f97316' : stat.color === 'text-emerald-600' ? '#10b981' : '#f59e0b'} />
                                </View>
                                <Text className="text-sm font-black text-slate-900 dark:text-white">{stat.value}</Text>
                                <Text className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                    {/* Menu Items */}
                    <View className="bg-white/80 dark:bg-slate-900/80 rounded-[32px] border-2 border-slate-50 dark:border-slate-800 overflow-hidden mb-6 shadow-sm">
                        {menuItems.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => item.href && router.push(item.href as any)}
                                className="flex-row items-center p-5 border-b-2 border-slate-50/50 dark:border-slate-800/50 last:border-b-0"
                            >
                                <View className="h-10 w-10 rounded-2xl bg-white dark:bg-slate-800 items-center justify-center mr-4 shadow-sm">
                                    <item.icon size={20} color={item.color} />
                                </View>
                                <Text className="flex-1 text-base font-black text-slate-900 dark:text-white">{item.label}</Text>
                                <View className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center">
                                    <Text className="text-slate-400 font-black">→</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Legal Links */}
                    <View className="flex-row justify-center gap-6 mb-10">
                        {legalItems.map((item, idx) => (
                            <TouchableOpacity key={idx} onPress={() => router.push(item.href as any)}>
                                <Text className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Sign Out */}
                    <Button
                        title="Sign Out"
                        variant="ghost"
                        onPress={signOut}
                        className="mb-32 text-red-500"
                        textClassName="text-red-500"
                    />
                    <View className="h-12" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
