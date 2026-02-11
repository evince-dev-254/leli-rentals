import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { User, Settings, HelpCircle, LogOut, ChevronRight, Home, LayoutDashboard, RefreshCw, ShieldCheck, MessageSquare, Smartphone } from 'lucide-react-native';
import { router } from 'expo-router';
import ScreenBackground from '../../components/ui/ScreenBackground';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { useNotifications } from '../../context/NotificationContext';
import { useUser } from '../../context/UserContext';

const SafeAreaView = styled(SafeAreaViewContext);

export default function ProfileScreen() {
    const { addNotification } = useNotifications();
    const { role, userName, email, isVerified } = useUser();

    const handleItemPress = (item: any) => {
        if (item.href) {
            router.push(item.href as any);
        }
    };

    const roleLabels = {
        renter: 'Renter',
        owner: 'Owner',
        agent: 'Affiliate'
    };

    const profileItems = [
        { icon: Home, label: 'My Apartments', href: '/(tabs)' },
        { icon: MessageSquare, label: 'Messages', href: '/messages' },
        { icon: LayoutDashboard, label: 'Application Review', href: '/(tabs)/dashboard' },
        ...(role === 'owner' ? [
            { icon: ShieldCheck, label: 'My Subscription', href: '/(user)/subscription' },
            { icon: ShieldCheck, label: 'Get Verified', href: '/(user)/verification' }
        ] : []),
        { icon: Smartphone, label: 'Software Updates', href: '/(user)/updates' },
        { icon: Settings, label: 'Settings', href: '/(user)/settings' },
        { icon: HelpCircle, label: 'Help', href: '/(user)/support' },
    ];

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1">
                <View className="px-6 pt-4">
                    <ScreenHeader title="My Profile" />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingHorizontal: 24 }}
                >
                    <View className="items-center mb-8 pt-4">
                        <TouchableOpacity
                            onPress={() => router.push('/(user)/edit-profile')}
                            className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4 relative shadow-lg"
                        >
                            {/* Avatar Placeholder */}
                            <View className="w-20 h-20 bg-slate-800 rounded-full" />

                            <View className="absolute bottom-0 right-0 bg-orange-500 w-8 h-8 rounded-full items-center justify-center border-2 border-white">
                                <Text className="text-white font-bold leading-none">+</Text>
                            </View>
                        </TouchableOpacity>

                        <Text className="text-xl font-outfit-bold text-slate-800">{userName}</Text>
                        <View className="flex-row items-center">
                            <Text className="text-sm text-slate-500 font-outfit">{email}</Text>
                            <View className="ml-2 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 flex-row items-center">
                                <Text className="text-[10px] text-blue-600 font-outfit-bold uppercase mr-1">{roleLabels[role]}</Text>
                                {isVerified && <ShieldCheck size={10} color="#3B82F6" />}
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => router.push('/(user)/edit-profile')}
                            className="mt-4 bg-slate-50 px-6 py-2 rounded-full border border-slate-100 shadow-sm"
                        >
                            <Text className="text-slate-600 font-outfit-bold text-xs uppercase tracking-widest">Edit Profile</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-lg font-outfit-bold text-slate-800 mb-4 px-2">Account Management</Text>

                    <View className="bg-white/80 rounded-3xl overflow-hidden shadow-sm border border-white mb-6">
                        {profileItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleItemPress(item)}
                                className={`flex-row items-center p-4 ${index < profileItems.length - 1 ? 'border-b border-slate-50/50' : ''}`}
                            >
                                <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center mr-4">
                                    <item.icon size={20} color="#64748B" />
                                </View>
                                <Text className="flex-1 font-outfit-medium text-slate-800">{item.label}</Text>
                                <ChevronRight size={16} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            onPress={() => router.replace('/(auth)/signup')}
                            className="flex-row items-center p-4 border-t border-slate-50/50"
                        >
                            <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-4">
                                <LogOut size={20} color="#EF4444" />
                            </View>
                            <Text className="flex-1 font-outfit-medium text-red-500">Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
