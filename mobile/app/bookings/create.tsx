import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Calendar, Clock, CreditCard, ArrowRight, X } from 'lucide-react-native';
import { BackButton } from '@/components/ui/back-button';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { PaystackCheckout } from '@/components/payment/paystack-checkout';

export default function CreateBookingScreen() {
    const { listingId, listingTitle, pricePerDay, ownerId } = useLocalSearchParams();
    const router = useRouter();
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [duration, setDuration] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPaystack, setShowPaystack] = useState(false);
    const [user, setUser] = useState<any>(null);

    const listingPrice = Number(pricePerDay) || 1000;

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleCreateBooking = async () => {
        if (!startDate || !endDate) {
            Alert.alert('Error', 'Please select rental dates');
            return;
        }

        // Instead of creating booking immediately, show Paystack
        setShowPaystack(true);
    };

    const handlePaymentSuccess = async (response: any) => {
        setShowPaystack(false);
        setLoading(true);

        try {
            if (!user) {
                Alert.alert('Error', 'Please login to continue');
                router.push('/auth/login');
                return;
            }

            const totalAmount = duration * listingPrice;

            // 1. Create booking after successful payment
            const { data: booking, error: bookingError } = await supabase
                .from('bookings')
                .insert({
                    listing_id: listingId,
                    renter_id: user.id,
                    owner_id: ownerId,
                    start_date: startDate?.toISOString().split('T')[0],
                    end_date: endDate?.toISOString().split('T')[0],
                    total_days: duration,
                    price_per_day: listingPrice,
                    subtotal: totalAmount,
                    total_amount: totalAmount,
                    status: 'confirmed',
                    payment_status: 'paid'
                })
                .select()
                .single();

            if (bookingError) throw bookingError;

            // 2. Create transaction record
            const { error: txError } = await supabase
                .from('transactions')
                .insert({
                    booking_id: booking.id,
                    user_id: user.id,
                    transaction_type: 'booking_payment',
                    amount: totalAmount,
                    payment_method: 'paystack',
                    provider_reference: response.transactionRef.reference,
                    status: 'completed',
                    metadata: { paystack_response: response }
                });

            if (txError) console.error('Transaction log error:', txError);

            Alert.alert(
                'Success!',
                'Payment received and booking confirmed.',
                [
                    { text: 'View Bookings', onPress: () => router.push('/bookings' as any) },
                    { text: 'OK', onPress: () => router.back() }
                ]
            );
        } catch (error) {
            console.error('Booking error:', error);
            Alert.alert('Error', 'Payment was successful but failed to save booking. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView className="flex-1">
                <View className="px-8 py-4">
                    <BackButton />
                </View>

                <ScrollView className="flex-1 px-8">
                    <Text className="text-4xl font-black text-slate-900 dark:text-white mb-2">Book Your Rental</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold mb-8">{listingTitle}</Text>

                    {/* Rental Period */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Select Rental Period</Text>

                        <View className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                            <View className="flex-row items-center mb-4">
                                <Calendar size={24} color="#f97316" />
                                <Text className="text-base font-bold text-slate-900 dark:text-white ml-3">Rental Duration</Text>
                            </View>

                            <View className="flex-row gap-3">
                                {[1, 3, 7, 14, 30].map((days) => (
                                    <TouchableOpacity
                                        key={days}
                                        onPress={() => {
                                            setDuration(days);
                                            const end = new Date();
                                            end.setDate(end.getDate() + days);
                                            setEndDate(end);
                                        }}
                                        className={`flex-1 py-3 rounded-2xl ${duration === days ? 'bg-orange-500' : 'bg-slate-100 dark:bg-slate-800'}`}
                                    >
                                        <Text className={`text-center font-bold ${duration === days ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                            {days}d
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Payment Method */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Payment Method</Text>

                        <TouchableOpacity className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <CreditCard size={24} color="#f97316" />
                                <View className="ml-3">
                                    <Text className="text-base font-bold text-slate-900 dark:text-white">Paystack</Text>
                                    <Text className="text-xs text-slate-400">Secure Payment via Paystack</Text>
                                </View>
                            </View>
                            <ArrowRight size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    {/* Summary */}
                    <View className="bg-orange-50 dark:bg-orange-900/20 rounded-3xl p-6 border border-orange-100 dark:border-orange-900/30 mb-8">
                        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-4">Booking Summary</Text>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-slate-600 dark:text-slate-400">Duration</Text>
                            <Text className="font-bold text-slate-900 dark:text-white">{duration} days</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-slate-600 dark:text-slate-400">Rate per day</Text>
                            <Text className="font-bold text-slate-900 dark:text-white">KES {listingPrice.toLocaleString()}</Text>
                        </View>
                        <View className="h-px bg-slate-200 dark:bg-slate-700 my-3" />
                        <View className="flex-row justify-between">
                            <Text className="text-lg font-black text-slate-900 dark:text-white">Total</Text>
                            <Text className="text-2xl font-black text-orange-500">KES {(duration * listingPrice).toLocaleString()}</Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Action */}
                <View className="px-8 py-6 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        title={loading ? "Processing..." : "Confirm & Pay"}
                        onPress={handleCreateBooking}
                        disabled={loading}
                        className="h-16 rounded-[28px] bg-orange-500"
                    />
                </View>

                {/* Paystack Modal */}
                <Modal visible={showPaystack} animationType="slide">
                    <View className="flex-1">
                        <SafeAreaView className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                            <Text className="text-xl font-black text-slate-900 dark:text-white">Secure Payment</Text>
                            <TouchableOpacity onPress={() => setShowPaystack(false)}>
                                <X size={24} color="#f97316" />
                            </TouchableOpacity>
                        </SafeAreaView>
                        <PaystackCheckout
                            amount={duration * listingPrice * 100} // Keep it as cents here, the component handles the conversion back for v5
                            email={user?.email || ''}
                            billingName={user?.user_metadata?.full_name}
                            onSuccess={handlePaymentSuccess}
                            onCancel={() => setShowPaystack(false)}
                        />
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}
