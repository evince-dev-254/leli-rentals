import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, CreditCard, Check, ShieldCheck } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';

const SafeAreaView = styled(SafeAreaViewContext);

export default function BookingScreen() {
    const { id } = useLocalSearchParams();
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);
    const [guests, setGuests] = useState(1);
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success

    // Mock Property Data (In a real app, fetch using ID)
    const property = {
        title: 'Luxury Villa in Diani',
        price: 450,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        rating: 4.9
    };

    const fees = {
        cleaning: 50,
        service: 30,
    };

    const calculateTotal = () => {
        const days = 3; // Mock duration
        return (property.price * days) + fees.cleaning + fees.service;
    };

    const handleConfirm = () => {
        setStep(3);
        setTimeout(() => {
            router.push('/(tabs)/dashboard'); // Redirect to dashboard after success
        }, 2000);
    };

    const renderDateSelection = () => (
        <View className="mb-6">
            <Text className="text-lg font-outfit-bold text-slate-800 mb-4">Select Dates</Text>
            <View className="flex-row gap-4">
                <TouchableOpacity className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <Text className="text-slate-500 font-outfit text-xs mb-1">Check-in</Text>
                    <View className="flex-row items-center">
                        <Calendar size={18} color="#F97316" className="mr-2" />
                        <Text className="text-slate-900 font-outfit-bold">Oct 12</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <Text className="text-slate-500 font-outfit text-xs mb-1">Check-out</Text>
                    <View className="flex-row items-center">
                        <Calendar size={18} color="#F97316" className="mr-2" />
                        <Text className="text-slate-900 font-outfit-bold">Oct 15</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Text className="text-slate-400 font-outfit text-xs mt-2 text-center">3 nights selected</Text>
        </View>
    );

    const renderPriceBreakdown = () => (
        <View className="bg-slate-50 p-5 rounded-3xl mb-6 border border-slate-100">
            <Text className="font-outfit-bold text-slate-800 mb-4">Price Details</Text>
            <View className="flex-row justify-between mb-2">
                <Text className="text-slate-600 font-outfit">${property.price} x 3 nights</Text>
                <Text className="text-slate-900 font-outfit-bold">${property.price * 3}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
                <Text className="text-slate-600 font-outfit">Cleaning Fee</Text>
                <Text className="text-slate-900 font-outfit-bold">${fees.cleaning}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
                <Text className="text-slate-600 font-outfit">Service Fee</Text>
                <Text className="text-slate-900 font-outfit-bold">${fees.service}</Text>
            </View>
            <View className="h-[1px] bg-slate-200 my-3" />
            <View className="flex-row justify-between">
                <Text className="text-lg font-outfit-bold text-slate-900">Total</Text>
                <Text className="text-lg font-outfit-bold text-orange-500">${calculateTotal()}</Text>
            </View>
        </View>
    );

    if (step === 3) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ScreenBackground />
                <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
                    <Check size={48} color="#16A34A" />
                </View>
                <Text className="text-2xl font-outfit-bold text-slate-900 mb-2">Booking Confirmed!</Text>
                <Text className="text-slate-500 font-outfit text-center px-10">
                    Your reservation at {property.title} has been successfully processed.
                </Text>
                <Text className="text-slate-400 font-outfit text-sm mt-8">Redirecting...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <ScreenBackground />
            <SafeAreaView className="flex-1">
                {/* Header */}
                <View className="px-6 py-4 flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white border border-slate-100 rounded-full items-center justify-center shadow-sm">
                        <ChevronLeft size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text className="text-xl font-outfit-bold text-slate-900 ml-4">Confirm Booking</Text>
                </View>

                <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>
                    {/* Property Summary */}
                    <View className="flex-row bg-white p-3 rounded-2xl border border-slate-100 shadow-sm mb-6">
                        <Image source={{ uri: property.image }} className="w-20 h-20 rounded-xl" />
                        <View className="ml-3 flex-1 justify-center">
                            <Text className="font-outfit text-slate-500 text-xs mb-1">Entire Villa</Text>
                            <Text className="font-outfit-bold text-slate-900 text-base mb-1">{property.title}</Text>
                            <View className="flex-row items-center">
                                <Text className="font-outfit-bold text-slate-900 text-sm">4.9</Text>
                                <Text className="text-slate-400 text-xs ml-1">(24 reviews)</Text>
                            </View>
                        </View>
                    </View>

                    {renderDateSelection()}

                    {/* Guests */}
                    <View className="mb-6">
                        <Text className="text-lg font-outfit-bold text-slate-800 mb-4">Guests</Text>
                        <View className="flex-row items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                            <View>
                                <Text className="font-outfit-bold text-slate-900">Guests</Text>
                                <Text className="text-slate-500 text-xs font-outfit">Age 13+</Text>
                            </View>
                            <View className="flex-row items-center gap-4">
                                <TouchableOpacity
                                    onPress={() => setGuests(Math.max(1, guests - 1))}
                                    className="w-8 h-8 rounded-full border border-slate-300 items-center justify-center"
                                >
                                    <Text className="text-slate-600 font-bold">-</Text>
                                </TouchableOpacity>
                                <Text className="font-outfit-bold text-slate-900 text-lg">{guests}</Text>
                                <TouchableOpacity
                                    onPress={() => setGuests(guests + 1)}
                                    className="w-8 h-8 rounded-full border border-slate-300 items-center justify-center"
                                >
                                    <Text className="text-slate-600 font-bold">+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {renderPriceBreakdown()}

                    {/* Payment Mock */}
                    <View className="mb-8">
                        <Text className="text-lg font-outfit-bold text-slate-800 mb-4">Payment Method</Text>
                        <View className="flex-row items-center bg-white border border-orange-200 p-4 rounded-2xl shadow-sm">
                            <View className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center mr-3">
                                <CreditCard size={20} color="#F97316" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-outfit-bold text-slate-900">•••• 4242</Text>
                                <Text className="text-slate-500 text-xs font-outfit">Expires 12/28</Text>
                            </View>
                            <Text className="text-orange-500 font-outfit-bold text-xs">Change</Text>
                        </View>
                    </View>

                    {/* Cancellation Policy */}
                    <View className="flex-row p-4 bg-blue-50 rounded-2xl mb-8">
                        <ShieldCheck size={20} color="#3B82F6" />
                        <Text className="flex-1 ml-3 text-blue-800 font-outfit text-xs leading-5">
                            Free cancellation for 48 hours. After that, cancel before check-in and get a 50% refund, minus the service fee.
                        </Text>
                    </View>
                </ScrollView>

                {/* Footer */}
                <View className="p-6 bg-white border-t border-slate-100">
                    <TouchableOpacity
                        onPress={handleConfirm}
                        className="bg-orange-500 w-full py-4 rounded-2xl items-center shadow-lg shadow-orange-200"
                    >
                        <Text className="text-white font-outfit-bold text-lg">Confirm and Pay</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}
