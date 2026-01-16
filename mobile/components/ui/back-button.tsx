import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { cn } from '@/lib/utils';

interface BackButtonProps {
    className?: string;
    onPress?: () => void;
}

export const BackButton = ({ className = '', onPress }: BackButtonProps) => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.back();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className={cn(
                'flex-row items-center bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 px-4 py-2 self-start rounded-full',
                className
            )}
            activeOpacity={0.7}
        >
            <ArrowLeft size={20} color={isDark ? 'white' : '#e67e22'} strokeWidth={3} />
            <Text className="ml-2 font-black text-[#e67e22] uppercase tracking-wider">
                Back
            </Text>
        </TouchableOpacity>
    );
};
