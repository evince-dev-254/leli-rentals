import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { cn } from '@/lib/utils';
import { MotiView } from 'moti';

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
                'z-50',
                className
            )}
            activeOpacity={0.7}
        >
            <MotiView
                from={{ opacity: 0, translateX: -10 }}
                animate={{ opacity: 1, translateX: 0 }}
                className="flex-row items-center bg-white/10 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 dark:border-slate-800 px-4 py-2 self-start rounded-full"
            >
                <ChevronLeft size={24} color={isDark ? 'white' : '#f97316'} strokeWidth={3} />
                <Text className="ml-1 font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">
                    Back
                </Text>
            </MotiView>
        </TouchableOpacity>
    );
};
