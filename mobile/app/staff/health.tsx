import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Activity, Server, Radio, Database, Cpu } from 'lucide-react-native';
import { MotiView } from 'moti';

export default function StaffHealthScreen() {
    const router = useRouter();

    const metrics = [
        { label: 'API Response', value: '124ms', status: 'optimal', icon: Radio },
        { label: 'DB Load', value: '12%', status: 'optimal', icon: Database },
        { label: 'Memory Usage', value: '44%', status: 'nominal', icon: Cpu },
        { label: 'Active Sockets', value: '8.2k', status: 'high', icon: Server },
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Stack.Screen
                options={{
                    title: 'Platform Pulse',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <ChevronLeft color="#3b82f6" size={24} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView className="flex-1 px-6 pt-4">
                <View className="mb-8 p-8 rounded-[40px] bg-slate-900 overflow-hidden relative">
                    <View className="absolute top-0 right-0 h-40 w-40 bg-emerald-500 rounded-full -mr-20 -mt-20 opacity-20" />
                    <View className="relative z-10">
                        <Activity color="#10b981" size={32} />
                        <Text className="text-white text-3xl font-black mt-4">All Systems Go</Text>
                        <Text className="text-white/60 text-sm mt-1">Operational status is nominal across all regions.</Text>
                    </View>
                </View>

                {/* Metrics Grid */}
                <View className="flex-row flex-wrap gap-4 mb-8">
                    {metrics.map((metric, idx) => (
                        <View key={idx} className="w-[47%] p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <metric.icon size={20} color="#94a3b8" />
                            <Text className="text-2xl font-black text-slate-900 dark:text-white mt-4">{metric.value}</Text>
                            <Text className="text-[10px] text-slate-400 uppercase font-bold mt-1 tracking-widest">{metric.label}</Text>
                            <View className="flex-row items-center mt-3">
                                <View className={`h-2 w-2 rounded-full ${metric.status === 'optimal' ? 'bg-emerald-500' : 'bg-orange-500'} mr-2`} />
                                <Text className={`text-[10px] font-bold uppercase ${metric.status === 'optimal' ? 'text-emerald-500' : 'text-orange-500'}`}>{metric.status}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
