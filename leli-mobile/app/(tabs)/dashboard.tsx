import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image, useWindowDimensions } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { MapPin, Star, Package, TrendingUp, Users, DollarSign, Clock, ChevronRight, Pin } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useNotifications } from '../../context/NotificationContext';
import { useUser } from '../../context/UserContext';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const SafeAreaView = styled(SafeAreaViewContext);

export default function DashboardScreen() {
    const { addNotification } = useNotifications();
    const { role, userName } = useUser();
    const { width } = useWindowDimensions();

    const renderRenterDashboard = () => (
        <Animated.View entering={FadeInDown.duration(800)}>
            {/* Stats Overview */}
            <View className="flex-row justify-between mb-8">
                <View className="bg-white/80 p-5 rounded-3xl items-center justify-center flex-1 mr-3 border border-white shadow-sm">
                    <Text className="text-orange-500 font-outfit-bold text-xl">03</Text>
                    <Text className="text-slate-500 text-[10px] uppercase font-outfit-bold mt-1">Bookings</Text>
                </View>
                <View className="bg-white/80 p-5 rounded-3xl items-center justify-center flex-1 mr-3 border border-white shadow-sm">
                    <Text className="text-purple-500 font-outfit-bold text-xl">12</Text>
                    <Text className="text-slate-500 text-[10px] uppercase font-outfit-bold mt-1">Favorites</Text>
                </View>
                <View className="bg-white/80 p-5 rounded-3xl items-center justify-center flex-1 border border-white shadow-sm">
                    <Text className="text-blue-500 font-outfit-bold text-xl">02</Text>
                    <Text className="text-slate-500 text-[10px] uppercase font-outfit-bold mt-1">Reviews</Text>
                </View>
            </View>

            {/* Upcoming Booking */}
            <Text className="text-lg font-outfit-bold text-slate-900 mb-4 ml-1">Upcoming Stay</Text>
            <View className="bg-white/80 p-4 rounded-3xl mb-8 border border-white shadow-sm">
                <View className="flex-row items-center mb-4">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400&auto=format&fit=crop' }}
                        className="w-20 h-20 rounded-2xl mr-4"
                    />
                    <View className="flex-1">
                        <Text className="text-base font-outfit-bold text-slate-800">Modern Loft Downtown</Text>
                        <Text className="text-sm text-slate-500 mb-1">Feb 15 - Feb 20, 2026</Text>
                        <View className="flex-row items-center">
                            <MapPin size={12} color="#F97316" className="mr-1" />
                            <Text className="text-xs text-orange-500 font-outfit-medium">Nairobi, Kenya</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity className="bg-slate-900 py-3 rounded-2xl items-center">
                    <Text className="text-white font-outfit-bold text-sm">View Booking Details</Text>
                </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <Text className="text-lg font-outfit-bold text-slate-900 mb-4 ml-1">Rent Again</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
                {[1, 2, 3].map((i) => (
                    <TouchableOpacity key={i} className="bg-white/80 p-3 rounded-[32px] mr-4 border border-white shadow-sm flex-row items-center">
                        <Image
                            source={{ uri: `https://via.placeholder.com/60/E2E8F0/94A3B8?text=Img${i}` }}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                        <View className="mr-4">
                            <Text className="text-sm font-outfit-bold text-slate-800">Studio {i}</Text>
                            <Text className="text-xs text-slate-500">$45/night</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );

    const renderOwnerDashboard = () => (
        <Animated.View entering={FadeInDown.duration(800)}>
            {/* Revenue Overview */}
            <View className="bg-slate-900 p-6 rounded-[32px] mb-8 shadow-xl relative overflow-hidden">
                <View className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full" />
                <View className="flex-row justify-between items-start mb-6">
                    <View>
                        <Text className="text-slate-400 text-xs font-outfit uppercase tracking-widest mb-1">Total Earnings</Text>
                        <Text className="text-white text-3xl font-outfit-bold">$12,850.45</Text>
                    </View>
                    <View className="bg-white/10 p-2 rounded-xl">
                        <TrendingUp size={20} color="#22C55E" />
                    </View>
                </View>
                <View className="flex-row items-center border-t border-white/10 pt-4">
                    <View className="flex-1">
                        <Text className="text-slate-400 text-[10px] font-outfit uppercase">Total Listings</Text>
                        <Text className="text-white font-outfit-bold text-lg">08</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-400 text-[10px] font-outfit uppercase">Occupancy</Text>
                        <Text className="text-white font-outfit-bold text-lg">92%</Text>
                    </View>
                </View>
            </View>

            {/* Performance Stats */}
            <View className="flex-row space-x-4 mb-8">
                <View className="bg-white/80 p-5 rounded-3xl flex-1 items-center border border-white shadow-sm">
                    <Users size={24} color="#6366F1" />
                    <Text className="text-slate-900 font-outfit-bold text-lg mt-2">1.2k</Text>
                    <Text className="text-slate-500 text-[10px] uppercase font-outfit-bold">Views</Text>
                </View>
                <View className="bg-white/80 p-5 rounded-3xl flex-1 items-center border border-white shadow-sm">
                    <Clock size={24} color="#F97316" />
                    <Text className="text-slate-900 font-outfit-bold text-lg mt-2">04</Text>
                    <Text className="text-slate-500 text-[10px] uppercase font-outfit-bold">Active</Text>
                </View>
            </View>

            {/* My Listings */}
            <View className="flex-row justify-between items-center mb-4 px-1">
                <Text className="text-lg font-outfit-bold text-slate-900">Manage Listings</Text>
                <TouchableOpacity>
                    <Text className="text-orange-500 font-outfit-bold text-sm">View All</Text>
                </TouchableOpacity>
            </View>
            {[1, 2].map((i) => (
                <View key={i} className="bg-white/80 p-4 rounded-3xl mb-4 flex-row items-center border border-white shadow-sm">
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=400&auto=format&fit=crop' }} className="w-16 h-16 rounded-2xl mr-4" />
                    <View className="flex-1">
                        <Text className="text-base font-outfit-bold text-slate-800">Luxury Penthouse {i}</Text>
                        <Text className="text-xs text-slate-500">Listed: Dec 12, 2025</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center border border-slate-100">
                        <ChevronRight size={16} color="#64748B" />
                    </TouchableOpacity>
                </View>
            ))}
        </Animated.View>
    );

    const renderAffiliateDashboard = () => (
        <Animated.View entering={FadeInDown.duration(800)}>
            {/* Commissions Overview */}
            <View className="bg-orange-600 p-6 rounded-[32px] mb-8 shadow-xl relative overflow-hidden">
                <View className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full" />
                <Text className="text-orange-100 text-xs font-outfit uppercase tracking-widest mb-1">Payout Balance</Text>
                <Text className="text-white text-3xl font-outfit-bold mb-6">$4,210.00</Text>
                <TouchableOpacity className="bg-white py-3 rounded-2xl items-center">
                    <Text className="text-orange-600 font-outfit-bold text-sm">Withdraw Funds</Text>
                </TouchableOpacity>
            </View>

            {/* Affiliate Progress */}
            <View className="bg-white/80 p-6 rounded-[32px] mb-8 border border-white shadow-sm">
                <Text className="text-sm font-outfit-bold text-slate-500 uppercase mb-4">Referral Link</Text>
                <View className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 flex-row justify-between items-center">
                    <Text className="text-slate-600 text-xs font-outfit select-all">leli.com/ref?u={userName.replace(' ', '')}</Text>
                    <TouchableOpacity>
                        <Text className="text-orange-500 font-outfit-bold text-xs uppercase">Copy</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-row space-x-4 mb-8">
                <View className="bg-white/80 p-5 rounded-3xl flex-1 border border-white shadow-sm">
                    <Users size={20} color="#F97316" />
                    <Text className="text-slate-900 font-outfit-bold text-xl mt-2">45</Text>
                    <Text className="text-slate-500 text-[10px] uppercase font-outfit-bold">New Leads</Text>
                </View>
                <View className="bg-white/80 p-5 rounded-3xl flex-1 border border-white shadow-sm">
                    <Star size={20} color="#F97316" />
                    <Text className="text-slate-900 font-outfit-bold text-xl mt-2">12</Text>
                    <Text className="text-slate-500 text-[10px] uppercase font-outfit-bold">Conversions</Text>
                </View>
            </View>
        </Animated.View>
    );

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-6 pt-4">
                <ScreenHeader title={`${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                >
                    {/* Welcome Card */}
                    <View className="bg-white/60 p-5 rounded-[32px] mb-8 border border-white shadow-sm">
                        <View className="flex-row items-center">
                            <View className="w-14 h-14 bg-slate-900 rounded-2xl items-center justify-center mr-4">
                                <Text className="text-2xl">👋</Text>
                            </View>
                            <View>
                                <Text className="text-slate-500 font-outfit text-sm">Welcome back,</Text>
                                <Text className="text-xl font-outfit-bold text-slate-800">{userName}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Role-Specific Content */}
                    {role === 'renter' && renderRenterDashboard()}
                    {role === 'owner' && renderOwnerDashboard()}
                    {role === 'agent' && renderAffiliateDashboard()}

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
