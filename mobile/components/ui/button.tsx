import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View } from 'react-native';
import { cn } from '@/lib/utils';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    textClassName?: string;
    style?: ViewStyle;
    icon?: React.ReactNode;
}

export const Button = ({
    onPress,
    title,
    variant = 'primary',
    loading = false,
    disabled = false,
    className = '',
    textClassName = '',
    style,
    icon,
}: ButtonProps) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return 'bg-[#f97316] shadow-lg shadow-orange-500/30';
            case 'secondary':
                return 'bg-white border-2 border-[#f97316]';
            case 'outline':
                return 'bg-transparent border-2 border-slate-200 dark:border-slate-800';
            case 'ghost':
                return 'bg-transparent';
            default:
                return 'bg-[#f97316]';
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary':
                return 'text-white';
            case 'secondary':
                return 'text-[#f97316]';
            case 'outline':
                return 'text-slate-900 dark:text-white';
            case 'ghost':
                return 'text-slate-500';
            default:
                return 'text-white';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                { height: 64, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
                style
            ]}
            className={cn(getVariantStyles(), disabled && 'opacity-50', className)}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : '#f97316'} />
            ) : (
                <View className="flex-row items-center justify-center">
                    {icon && <View className="mr-3">{icon}</View>}
                    <Text className={cn('text-lg font-black uppercase tracking-widest', getTextColor(), textClassName)}>
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};
