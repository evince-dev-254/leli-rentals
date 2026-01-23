import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '@/components/theme-provider';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Sun, Moon, Monitor, Check, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

export default function ThemeSettingsScreen() {
    const { theme, mode, setThemeMode } = useTheme();
    const router = useRouter();

    const themes = [
        {
            id: 'light',
            name: 'Light Mode',
            description: 'Classic clean look',
            icon: Sun,
            color: '#f59e0b',
        },
        {
            id: 'dark',
            name: 'Dark Mode',
            description: 'Easier on the eyes',
            icon: Moon,
            color: '#8b5cf6',
        },
        {
            id: 'system',
            name: 'System Default',
            description: 'Matches device settings',
            icon: Monitor,
            color: '#6366f1',
        },
    ] as const;

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-6 py-4 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
                    >
                        <ChevronLeft size={24} color={theme === 'dark' ? '#f8fafc' : '#0f172a'} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-slate-900 dark:text-white">Appearance</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-6">
                    <View className="mt-8">
                        <Text className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                            Choose Your Theme
                        </Text>

                        {themes.map((t, index) => (
                            <MotiView
                                key={t.id}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: index * 100 }}
                            >
                                <TouchableOpacity
                                    onPress={() => setThemeMode(t.id)}
                                    className={`mb-4 flex-row items-center justify-between p-5 rounded-3xl border-2 ${mode === t.id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                                        }`}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View
                                            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                            style={{ backgroundColor: t.color + '20' }}
                                        >
                                            <t.icon size={24} color={t.color} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-lg font-bold text-slate-900 dark:text-white">
                                                {t.name}
                                            </Text>
                                            <Text className="text-sm text-slate-500 dark:text-slate-400">
                                                {t.description}
                                            </Text>
                                        </View>
                                    </View>

                                    {mode === t.id && (
                                        <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center">
                                            <Check size={18} color="white" />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </View>

                    <View className="mt-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <Text className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                            Tip: Dark mode can help reduce eye strain in low-light environments and may save battery on devices with OLED screens.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
