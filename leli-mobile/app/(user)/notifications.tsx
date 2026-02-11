import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ViewStyle } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { Bell, Info, ShieldCheck, Home as HomeIcon, ChevronRight, Inbox } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useNotifications, ICON_MAP, Notification } from '../../context/NotificationContext';
import { router } from 'expo-router';

const SafeAreaView = styled(SafeAreaViewContext);

export default function NotificationsScreen() {
    const { notifications, markAllAsRead, markAsRead, clearNotifications } = useNotifications();

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-6 pt-4">
                <ScreenHeader title="Notifications" />

                <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
                    <View className="flex-row justify-between items-center mb-6 px-2">
                        <Text className="text-sm font-outfit-bold text-slate-400 uppercase tracking-widest">Recent Activity</Text>
                        <View className="flex-row">
                            <TouchableOpacity onPress={markAllAsRead} className="mr-4">
                                <Text className="text-xs font-outfit-bold text-orange-500">Read All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={clearNotifications}>
                                <Text className="text-xs font-outfit-bold text-slate-400">Clear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {notifications.length === 0 ? (
                        <View className="flex-1 items-center justify-center py-20">
                            <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                                <Inbox size={40} color="#CBD5E1" />
                            </View>
                            <Text className="text-lg font-outfit-bold text-slate-400">No Notifications Yet</Text>
                            <Text className="text-sm font-outfit text-slate-400 text-center px-10 mt-2">
                                We&apos;ll let you know when something important happens!
                            </Text>
                        </View>
                    ) : (
                        notifications.map((item) => {
                            const Icon = ICON_MAP[item.iconName] || ICON_MAP.Bell;
                            const colors = {
                                success: '#10B981',
                                info: '#F97316',
                                warning: '#F59E0B',
                                error: '#EF4444',
                            };
                            const color = colors[item.type] || colors.info;

                            const handleNotificationPress = (item: any) => {
                                markAsRead(item.id);
                                if (item.data?.targetPath) {
                                    router.push(item.data.targetPath);
                                }
                            };

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => handleNotificationPress(item)}
                                    className={`flex-row items-center p-5 rounded-3xl mb-4 border ${item.unread ? 'bg-orange-50/50 border-orange-100' : 'bg-white border-slate-100'
                                        } shadow-sm`}
                                >
                                    <View
                                        style={{ backgroundColor: color + '20' }}
                                        className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                    >
                                        <Icon size={22} color={color} strokeWidth={2.5} />
                                    </View>

                                    <View className="flex-1">
                                        <View className="flex-row justify-between items-center mb-1">
                                            <Text className="text-base font-outfit-bold text-slate-900">{item.title}</Text>
                                            <Text className="text-[10px] font-outfit text-slate-400">{item.time}</Text>
                                        </View>
                                        <Text className="text-sm font-outfit text-slate-500 leading-snug" numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                    </View>
                                    {item.unread && (
                                        <View className="w-2 h-2 bg-orange-500 rounded-full ml-2" />
                                    )}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
