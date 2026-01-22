import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { cn } from '@/lib/utils';
import { MotiView, AnimatePresence } from 'moti';
import { LinearTransition } from 'react-native-reanimated';

interface Tab {
    id: string;
    label: string;
    icon?: any;
}

interface DashboardTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
    activeColor?: string;
}

export function DashboardTabs({ tabs, activeTab, onTabChange, activeColor = '#f97316' }: DashboardTabsProps) {
    return (
        <View className="mb-6">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
            >
                <View className="flex-row bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-[24px] border border-slate-200 dark:border-slate-800">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <TouchableOpacity
                                key={tab.id}
                                onPress={() => onTabChange(tab.id)}
                                className="relative py-2.5 px-6 rounded-[20px] overflow-hidden"
                            >
                                {isActive && (
                                    <AnimatePresence>
                                        <MotiView
                                            layout={LinearTransition.springify().damping(20).stiffness(200)}
                                            from={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                                            className="absolute inset-0 bg-white dark:bg-slate-800 shadow-sm"
                                        />
                                    </AnimatePresence>
                                )}
                                <View className="flex-row items-center">
                                    {tab.icon && (
                                        <tab.icon
                                            size={16}
                                            color={isActive ? activeColor : '#64748b'}
                                            className="mr-2"
                                        />
                                    )}
                                    <Text className={cn(
                                        "text-xs font-black uppercase tracking-widest",
                                        isActive ? "text-slate-900 dark:text-white" : "text-slate-500"
                                    )}>
                                        {tab.label}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}
