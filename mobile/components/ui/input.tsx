import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

interface InputProps extends TextInputProps {
    label?: string;
    icon?: React.ReactNode;
    isPassword?: boolean;
    containerClassName?: string;
}

export const Input = ({
    label,
    icon,
    isPassword = false,
    containerClassName = '',
    className = '',
    ...props
}: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <View className={cn('mb-6', containerClassName)}>
            {label && (
                <Text className="text-slate-900 dark:text-white font-bold text-sm mb-2 ml-1">
                    {label}
                </Text>
            )}
            <View
                className={cn(
                    'flex-row items-center border-2 border-slate-100 dark:border-white/5 bg-[#fafafa] dark:bg-white/5 h-16 px-4 rounded-[24px]',
                    isDark ? '' : 'shadow-inner'
                )}
            >
                {icon && <View className="mr-3">{icon}</View>}
                <TextInput
                    {...props}
                    secureTextEntry={isPassword && !showPassword}
                    placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.3)" : "#94a3b8"}
                    className={cn(
                        'flex-1 text-slate-900 dark:text-white font-semibold text-base',
                        className
                    )}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="p-2"
                    >
                        {showPassword ? (
                            <EyeOff size={20} color={isDark ? "white" : "#94a3b8"} />
                        ) : (
                            <Eye size={20} color={isDark ? "white" : "#94a3b8"} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
