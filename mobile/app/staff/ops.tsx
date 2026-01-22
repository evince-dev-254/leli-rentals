import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Linking, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Smartphone,
    Send,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Bell,
    Cpu,
    ShieldCheck,
    Package,
    ChevronLeft
} from 'lucide-react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { cn } from '@/lib/utils';
import { BackgroundGradient } from '@/components/ui/background-gradient';

export default function MobileOpsScreen() {
    const router = useRouter();
    const [pushTitle, setPushTitle] = useState('');
    const [pushMessage, setPushMessage] = useState('');
    const [sending, setSending] = useState(false);

    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);

    const handleSendPush = async () => {
        if (!pushTitle || !pushMessage) return;
        setSending(true);
        // Simulate API call to send push
        setTimeout(() => {
            Alert.alert('Success', 'Push notification dispatched to all mobile devices!');
            setSending(false);
            setPushTitle('');
            setPushMessage('');
        }, 1500);
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 pt-10 pb-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="h-12 w-12 bg-white/50 dark:bg-slate-900/50 rounded-2xl items-center justify-center border-2 border-slate-50 dark:border-slate-800 shadow-sm mr-4"
                        >
                            <ChevronLeft size={24} color="#0f172a" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-2xl font-black text-slate-900 dark:text-white">Mobile Operations</Text>
                            <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Mission Control</Text>
                        </View>
                    </View>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

                    {/* App Health Grid */}
                    <View className="flex-row flex-wrap gap-4 mt-8">
                        <MotiView
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            className="flex-1 min-w-[45%] p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
                        >
                            <View className="flex-row items-center mb-4">
                                <View className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 items-center justify-center mr-3">
                                    <Cpu size={20} color="#3b82f6" />
                                </View>
                                <Text className="font-black text-slate-900 dark:text-white">App Health</Text>
                            </View>
                            <View className="space-y-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-xs text-slate-500 font-bold">API Status</Text>
                                    <Text className="text-xs text-emerald-500 font-black">Optimal</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-xs text-slate-500 font-bold">Latency</Text>
                                    <Text className="text-xs text-slate-900 dark:text-white font-black">12ms</Text>
                                </View>
                            </View>
                        </MotiView>

                        <MotiView
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 100 }}
                            className="flex-1 min-w-[45%] p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
                        >
                            <View className="flex-row items-center mb-4">
                                <View className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 items-center justify-center mr-3">
                                    <ShieldCheck size={20} color="#a855f7" />
                                </View>
                                <Text className="font-black text-slate-900 dark:text-white">Auth Pulse</Text>
                            </View>
                            <View className="space-y-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-xs text-slate-500 font-bold">Act. Users</Text>
                                    <Text className="text-xs text-slate-900 dark:text-white font-black">4.2k</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-xs text-slate-500 font-bold">Biometrics</Text>
                                    <Text className="text-xs text-slate-900 dark:text-white font-black">64%</Text>
                                </View>
                            </View>
                        </MotiView>
                    </View>

                    {/* Remote Dispatch (Push) */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 200 }}
                        className="mt-8 p-8 rounded-[40px] bg-slate-900 dark:bg-slate-800 border-2 border-slate-800 shadow-2xl shadow-blue-500/10"
                    >
                        <View className="flex-row items-center mb-6">
                            <View className="h-14 w-14 rounded-3xl bg-blue-600 items-center justify-center mr-4">
                                <Bell size={28} color="white" />
                            </View>
                            <View>
                                <Text className="text-xl font-black text-white">Remote Dispatch</Text>
                                <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest">Global Broadcast</Text>
                            </View>
                        </View>

                        <View className="space-y-4">
                            <TextInput
                                placeholder="Notification Title"
                                placeholderTextColor="#64748b"
                                value={pushTitle}
                                onChangeText={setPushTitle}
                                className="bg-slate-800 dark:bg-slate-900 border border-slate-700 p-5 rounded-2xl text-white font-bold"
                            />
                            <TextInput
                                placeholder="Message Payload"
                                placeholderTextColor="#64748b"
                                value={pushMessage}
                                onChangeText={setPushMessage}
                                multiline
                                numberOfLines={3}
                                className="bg-slate-800 dark:bg-slate-900 border border-slate-700 p-5 rounded-2xl text-white font-bold text-sm leading-5"
                                style={{ textAlignVertical: 'top' }}
                            />
                            <TouchableOpacity
                                onPress={handleSendPush}
                                disabled={sending || !pushTitle || !pushMessage}
                                className={cn(
                                    "h-16 rounded-[24px] items-center justify-center flex-row shadow-xl",
                                    (sending || !pushTitle || !pushMessage) ? "bg-slate-700" : "bg-blue-600 shadow-blue-600/20"
                                )}
                            >
                                {sending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Send size={18} color="white" />
                                        <Text className="text-white font-black ml-2 uppercase tracking-widest text-xs">Dispatch Pulse</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </MotiView>

                    {/* App Configuration */}
                    <View className="mt-8">
                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Configuration Hub</Text>
                        <View className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-2 shadow-sm overflow-hidden">

                            <View className="flex-row items-center p-5 border-b border-slate-50 dark:border-slate-800">
                                <View className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 items-center justify-center mr-4">
                                    <ShieldCheck size={20} color="#f97316" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-black text-slate-800 dark:text-white">Maintenance Mode</Text>
                                    <Text className="text-[10px] text-slate-400 font-bold uppercase">Lock all mobile activity</Text>
                                </View>
                                <Switch
                                    value={maintenanceMode}
                                    onValueChange={setMaintenanceMode}
                                    trackColor={{ false: '#f1f5f9', true: '#f97316' }}
                                />
                            </View>

                            <View className="flex-row items-center p-5 border-b border-slate-50 dark:border-slate-800 text-slate-50">
                                <View className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 items-center justify-center mr-4">
                                    <RefreshCw size={20} color="#3b82f6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-black text-slate-800 dark:text-white">Force Update</Text>
                                    <Text className="text-[10px] text-slate-400 font-bold uppercase">Require latest build</Text>
                                </View>
                                <Switch
                                    value={forceUpdate}
                                    onValueChange={setForceUpdate}
                                    trackColor={{ false: '#f1f5f9', true: '#3b82f6' }}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={() => Alert.alert('Cache Cleared', 'Inventory and session cache has been wiped on the server.')}
                                className="flex-row items-center p-5"
                            >
                                <View className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 items-center justify-center mr-4">
                                    <Package size={20} color="#64748b" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-black text-slate-800 dark:text-white">Wipe Server Cache</Text>
                                    <Text className="text-[10px] text-slate-400 font-bold uppercase">Reset inventory state</Text>
                                </View>
                                <ChevronLeft size={16} color="#94a3b8" style={{ transform: [{ rotate: '180deg' }] }} />
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View className="h-20" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
