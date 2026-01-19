import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Search, UserMinus, ShieldCheck, Mail } from 'lucide-react-native';

export default function StaffUsersScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <Stack.Screen
                options={{
                    title: 'User Moderation',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <ChevronLeft color="#3b82f6" size={24} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <View className="flex-1 px-6 pt-4">
                {/* Search Header */}
                <View className="mb-6 flex-row items-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-4">
                    <Search color="#94a3b8" size={20} />
                    <TextInput
                        placeholder="Search by name, email, or ID..."
                        placeholderTextColor="#94a3b8"
                        className="flex-1 h-12 ml-2 text-slate-900 dark:text-white"
                    />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <View key={i} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4 flex-row items-center">
                            <View className="h-12 w-12 rounded-full bg-blue-100 items-center justify-center mr-4">
                                <Text className="font-bold text-blue-600">U{i}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-base font-bold text-slate-900 dark:text-white">User #{1024 + i}</Text>
                                <Text className="text-xs text-slate-400">user{i}@example.com</Text>
                            </View>
                            <View className="flex-row gap-2">
                                <TouchableOpacity className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 items-center justify-center">
                                    <Mail size={16} color="#64748b" />
                                </TouchableOpacity>
                                <TouchableOpacity className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/20 items-center justify-center">
                                    <UserMinus size={16} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
