import React from 'react';
import { TouchableOpacity, Animated, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface BackButtonProps {
    label?: string;
    onPress?: () => void;
}

export default function BackButton({ label = 'Back', onPress }: BackButtonProps) {
    const scale = React.useRef(new Animated.Value(1)).current;
    const opacity = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 0.95,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0.7,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                friction: 4,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.back();
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            className="mb-4"
        >
            <Animated.View
                style={{ transform: [{ scale }], opacity }}
                className="flex-row items-center"
            >
                <View className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-slate-100 shadow-sm mr-3">
                    <ChevronLeft size={20} color="#1E293B" strokeWidth={2.5} />
                </View>
                {label && (
                    <Text className="text-slate-900 font-outfit-bold text-base">{label}</Text>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
}
