import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Bell, Menu, Pin } from 'lucide-react-native';
import { router, usePathname } from 'expo-router';
import SideMenu from './SideMenu';
import { useUser } from '../../context/UserContext';
import { useNotifications } from '../../context/NotificationContext';

interface ScreenHeaderProps {
    title?: string;
}

export default function ScreenHeader({ title }: ScreenHeaderProps) {
    const [menuVisible, setMenuVisible] = useState(false);
    const pathname = usePathname();
    const { togglePinPage, isPinned } = useUser();
    const { addNotification } = useNotifications();

    const handlePin = async () => {
        const pageId = pathname.split('/').pop() || 'home';
        const label = title || pageId.charAt(0).toUpperCase() + pageId.slice(1);
        const resolvedHref = pathname === '/' ? '/(tabs)' : pathname;

        togglePinPage({
            id: pathname,
            label,
            href: resolvedHref,
            icon: 'LayoutDashboard' // Default icon for pinned pages
        });

        await addNotification({
            title: isPinned(pathname) ? 'Page Unpinned' : 'Page Pinned',
            description: `${label} has been ${isPinned(pathname) ? 'removed from' : 'added to'} your shortcuts.`,
            type: 'info',
            iconName: 'Pin',
        });
    };

    return (
        <View className="mb-6 px-1">
            <View className="flex-row justify-between items-center mb-2">
                <Image
                    source={require('../../assets/images/logo.png')}
                    className="h-7 w-28"
                    resizeMode="contain"
                />

                <View className="flex-row items-center space-x-3">
                    {/* Pin Page Button */}
                    <TouchableOpacity
                        onPress={handlePin}
                        className={`w-9 h-9 items-center justify-center rounded-full border ${isPinned(pathname)
                            ? 'bg-orange-500 border-orange-600'
                            : 'bg-white border-slate-100 shadow-sm'
                            }`}
                    >
                        <Pin size={16} color={isPinned(pathname) ? 'white' : '#64748B'} fill={isPinned(pathname) ? 'white' : 'none'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/(user)/notifications')}
                        className="w-9 h-9 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100"
                    >
                        <Bell size={18} color="#64748B" />
                        <View className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border border-white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setMenuVisible(true)}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md border border-slate-100 ml-1"
                    >
                        <Menu size={24} color="#1E293B" strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>
            </View>

            {title && (
                <View className="mt-2">
                    <Text className="text-2xl font-outfit-bold text-slate-900 tracking-tight">
                        {title}
                    </Text>
                </View>
            )}

            <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </View>
    );
}
