import React from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react-native';

const pendingVerifications = [
    { id: '1', name: 'John Doe', status: 'Pending', date: '2026-01-14', type: 'Owner' },
    { id: '2', name: 'Jane Smith', status: 'In Review', date: '2026-01-15', type: 'Renter' },
    { id: '3', name: 'Mike Ross', status: 'Pending', date: '2026-01-13', type: 'Owner' },
];

export default function StaffVerificationsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Stack.Screen
                options={{
                    title: 'Verifications',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <ChevronLeft color="#3b82f6" size={24} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View className="flex-row gap-4 mr-4">
                            <TouchableOpacity><Search color="#64748b" size={20} /></TouchableOpacity>
                            <TouchableOpacity><Filter color="#64748b" size={20} /></TouchableOpacity>
                        </View>
                    )
                }}
            />

            <View className="flex-1 px-6 pt-6">
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-2xl font-black text-slate-900 dark:text-white">Review Queue</Text>
                        <Text className="text-slate-500 text-sm">3 pending approvals</Text>
                    </View>
                </View>

                <FlatList
                    data={pendingVerifications}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View className="p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4">
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center">
                                    <View className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center mr-3">
                                        <Text className="font-bold text-slate-500">{item.name[0]}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-base font-bold text-slate-900 dark:text-white">{item.name}</Text>
                                        <Text className="text-xs text-slate-400">{item.type} Account</Text>
                                    </View>
                                </View>
                                <View className="bg-orange-50 dark:bg-orange-950/30 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-900/50">
                                    <Text className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{item.status}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center mb-6">
                                <Clock size={12} color="#94a3b8" />
                                <Text className="text-[11px] text-slate-500 ml-1">Submitted on {item.date}</Text>
                            </View>

                            <View className="flex-row gap-3">
                                <TouchableOpacity className="flex-1 bg-blue-600 h-12 rounded-2xl items-center justify-center shadow-sm">
                                    <Text className="text-white font-bold">Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="h-12 w-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl items-center justify-center shadow-sm">
                                    <XCircle color="#ef4444" size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}
