import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { User, Bell, Lock, Globe, Moon, ChevronRight, CircleHelp } from 'lucide-react-native';
import ScreenBackground from '../../components/ui/ScreenBackground';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useNotifications } from '../../context/NotificationContext';

const SafeAreaView = styled(SafeAreaViewContext);

export default function SettingsScreen() {
    const { addNotification } = useNotifications();
    const [notifications, setNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);

    const handleToggle = (label: string, value: boolean) => {
        const newValue = !value;
        if (label === 'Push Notifications') setNotifications(newValue);
        else setDarkMode(newValue);

        addNotification({
            title: 'Setting Changed',
            description: `${label} is now ${newValue ? 'Enabled' : 'Disabled'}`,
            type: 'success',
            iconName: 'Settings',
        });
    };

    const handleLinkPress = (label: string) => {
        addNotification({
            title: 'App Settings',
            description: `Opening ${label}...`,
            type: 'info',
            iconName: 'Info',
        });
    };

    const SettingItem = ({ icon: Icon, label, value, type = 'link' }: any) => (
        <TouchableOpacity
            onPress={() => type === 'link' ? handleLinkPress(label) : handleToggle(label, value)}
            className="flex-row items-center py-4 px-2 border-b border-slate-50"
        >
            <View className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center mr-4">
                <Icon size={20} color="#64748B" />
            </View>
            <Text className="flex-1 font-outfit-medium text-slate-700 text-base">{label}</Text>
            {type === 'toggle' ? (
                <Switch
                    value={value}
                    onValueChange={() => handleToggle(label, value)}
                    trackColor={{ false: '#CBD5E1', true: '#FED7AA' }}
                    thumbColor={value ? '#F97316' : '#F1F5F9'}
                />
            ) : (
                <ChevronRight size={18} color="#CBD5E1" />
            )}
        </TouchableOpacity>
    );

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-6 pt-4">
                <ScreenHeader title="Settings" />

                <ScrollView showsVerticalScrollIndicator={false} className="mt-6">
                    <Text className="text-xs font-outfit-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Account</Text>
                    <View className="bg-white/80 rounded-3xl p-2 border border-white shadow-sm mb-8">
                        <SettingItem icon={User} label="Profile Information" />
                        <SettingItem icon={Lock} label="Password & Security" />
                        <SettingItem icon={Globe} label="Language" />
                    </View>

                    <Text className="text-xs font-outfit-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">App Settings</Text>
                    <View className="bg-white/80 rounded-3xl p-2 border border-white shadow-sm mb-8">
                        <SettingItem icon={Bell} label="Push Notifications" type="toggle" value={notifications} />
                        <SettingItem icon={Moon} label="Dark Mode" type="toggle" value={darkMode} />
                    </View>

                    <Text className="text-xs font-outfit-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Support</Text>
                    <View className="bg-white/80 rounded-3xl p-2 border border-white shadow-sm mb-8">
                        <SettingItem icon={CircleHelp} label="Help Center" />
                        <SettingItem icon={Lock} label="Privacy Policy" />
                    </View>

                    <TouchableOpacity className="mt-4 mb-10 items-center">
                        <Text className="text-red-500 font-outfit-bold">Delete Account</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
