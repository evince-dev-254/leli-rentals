import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNotifications, ICON_MAP } from '../../context/NotificationContext';
import { X } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const TOAST_COLORS = {
    success: '#10B981',
    info: '#F97316',
    warning: '#F59E0B',
    error: '#EF4444',
};

export default function Toast() {
    const { width } = useWindowDimensions();
    const { notifications } = useNotifications();
    const [currentToast, setCurrentToast] = React.useState<any>(null);
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const unreadCount = notifications.filter(n => n.unread).length;
        if (unreadCount > 0) {
            const latest = notifications[0];
            showToast(latest);
        }
    }, [notifications]);

    const showToast = (notification: any) => {
        setCurrentToast(notification);

        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 20,
                useNativeDriver: true,
                friction: 8,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();

        // Auto hide after 4 seconds
        setTimeout(hideToast, 4000);
    };

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setCurrentToast(null);
        });
    };

    if (!currentToast) return null;

    const Icon = ICON_MAP[currentToast.iconName as keyof typeof ICON_MAP] || ICON_MAP.Bell;
    const color = TOAST_COLORS[currentToast.type as keyof typeof TOAST_COLORS] || TOAST_COLORS.info;

    const handlePress = () => {
        router.push('/(user)/notifications');
        hideToast();
    };

    return (
        <Animated.View
            style={{
                transform: [{ translateY }],
                opacity,
                position: 'absolute',
                top: 50, // Moved down slightly
                left: 20,
                right: 20,
                zIndex: 9999,
            }}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={handlePress}
            >
                <LinearGradient
                    colors={['#A855F7', '#EC4899', '#F97316']} // Purple -> Pink -> Orange
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-[28px] p-[1px]" // Gradient border effect
                >
                    <View className="bg-white/95 rounded-[27px] p-4 flex-row items-center backdrop-blur-md">
                        <View
                            style={{ backgroundColor: color + '20' }}
                            className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        >
                            <Icon size={24} color={color} strokeWidth={2.5} />
                        </View>

                        <View className="flex-1">
                            <Text className="text-base font-outfit-bold text-slate-900" numberOfLines={1}>
                                {currentToast.title}
                            </Text>
                            <Text className="text-sm font-outfit text-slate-500" numberOfLines={1}>
                                {currentToast.description}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={hideToast} className="p-2 ml-1">
                            <X size={18} color="#94A3B8" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}
