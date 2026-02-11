import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Animated,
    Pressable,
    Image,
    ScrollView,
    useWindowDimensions
} from 'react-native';
import { Home, LayoutDashboard, Package, Crown, ShieldCheck, Heart, Bell, User, Settings, HelpCircle, X, RefreshCw, ChevronRight, LogOut, MessageSquare, Download, Pin, Smartphone, LayoutGrid } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../context/NotificationContext';
import { useUser, UserRole } from '../../context/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
}

export default function SideMenu({ visible: isOpen, onClose }: SideMenuProps) {
    const { width: windowWidth } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { addNotification } = useNotifications();
    const { role, switchRole, userName, email, isVerified, pinnedPages } = useUser();

    // Initialize slideAnim based on windowWidth
    const slideAnim = React.useRef(new Animated.Value(-windowWidth * 0.8)).current;

    const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

    useEffect(() => {
        if (isOpen) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                friction: 8,
                tension: 40,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -windowWidth * 0.8,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [isOpen, windowWidth]);

    const roleLabels: Record<UserRole, string> = {
        renter: 'Renter',
        owner: 'Owner',
        agent: 'Affiliate'
    };

    const handleRoleSwitch = async (newRole: UserRole) => {
        switchRole(newRole);
        setShowRoleSwitcher(false);
        await addNotification({
            title: 'Account Switched',
            description: `Now using Leli as ${roleLabels[newRole]}`,
            type: 'success',
            iconName: 'User',
        });
    };

    const getMenuItems = () => {
        const baseItems = [
            { icon: Home, label: 'Home', href: '/(tabs)' },
            { icon: LayoutGrid, label: 'Categories', href: '/(tabs)/categories' },
            { icon: LayoutDashboard, label: 'Dashboard', href: '/(tabs)/dashboard' },
            { icon: MessageSquare, label: 'Messages', href: '/messages' },
        ];

        const ownerOnlyItems = [
            { icon: Package, label: 'My Listings', href: '/(tabs)/dashboard' },
            { icon: Crown, label: 'Subscription', href: '/(user)/subscription' },
            { icon: ShieldCheck, label: 'Verification', href: '/(user)/verification' },
        ];

        const renterOnlyItems = [
            { icon: Package, label: 'My Bookings', href: '/(tabs)/dashboard' },
            { icon: Heart, label: 'Favorites', href: '/(tabs)/favorites' },
        ];

        const settingsItems = [
            { icon: Bell, label: 'Notifications', href: '/(user)/notifications' },
            { icon: User, label: 'My Profile', href: '/(tabs)/profile' },
            { icon: Smartphone, label: 'Software Updates', href: '/(user)/updates' },
            { icon: Settings, label: 'Settings', href: '/(user)/settings' },
            { icon: HelpCircle, label: 'Help & Support', href: '/(user)/support' },
        ];

        let menuItems = [...baseItems];
        if (role === 'owner') menuItems = [...menuItems, ...ownerOnlyItems];
        else if (role === 'renter') menuItems = [...menuItems, ...renterOnlyItems];

        return [...menuItems, ...settingsItems];
    };

    const menuItems = getMenuItems();

    const handleNavigate = (href: string, label: string) => {
        onClose();
        setTimeout(() => {
            router.push(href as any);
        }, 100);
    };

    const handleSignOut = () => {
        router.replace('/(auth)/signup');
    };

    return (
        <Modal
            transparent
            visible={isOpen}
            animationType="none"
            onRequestClose={onClose}
        >
            <View className="flex-1 flex-row">
                <Animated.View
                    style={{
                        transform: [{ translateX: slideAnim }],
                        width: windowWidth * 0.8,
                    }}
                    className="bg-white h-full shadow-2xl"
                >
                    {/* Header */}
                    <View
                        style={{ paddingTop: Math.max(insets.top, 16) }}
                        className="pb-6 px-6 bg-slate-50 border-b border-slate-100"
                    >
                        <TouchableOpacity
                            onPress={onClose}
                            style={{ top: Math.max(insets.top - 10, 10) }}
                            className="absolute right-4 p-2 bg-white rounded-full shadow-sm border border-slate-100 z-10"
                        >
                            <X size={18} color="#1E293B" strokeWidth={2.5} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleNavigate('/(tabs)', 'Home')}
                            className="mb-6 flex-row items-center"
                        >
                            <Image
                                source={require('../../assets/images/logo.png')}
                                className="h-7 w-28"
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center flex-1">
                                <View className="w-12 h-12 bg-slate-200 rounded-xl items-center justify-center border border-slate-100 relative overflow-hidden">
                                    <User size={24} color="#64748B" strokeWidth={2} />
                                    {isVerified && (
                                        <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-white">
                                            <ShieldCheck size={10} color="white" />
                                        </View>
                                    )}
                                </View>
                                <View className="ml-3 flex-1">
                                    <View className="flex-row items-center gap-1">
                                        <Text className="text-slate-900 text-base font-outfit-bold leading-tight truncate">{userName}</Text>
                                        {isVerified && <ShieldCheck size={14} color="#3B82F6" />}
                                    </View>
                                    <View className="flex-row items-center">
                                        <Text className="text-orange-600 text-[10px] font-outfit-bold uppercase tracking-tight mr-2">{roleLabels[role]}</Text>
                                        <View className="w-1 h-1 rounded-full bg-slate-300 mr-2" />
                                        <Text className="text-slate-500 text-[10px] font-outfit truncate max-w-[100px]">{email}</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={() => setShowRoleSwitcher(!showRoleSwitcher)}
                                className="bg-orange-500 w-10 h-10 rounded-full items-center justify-center shadow-sm"
                            >
                                <RefreshCw size={16} color="white" />
                            </TouchableOpacity>
                        </View>

                        {showRoleSwitcher && (
                            <View className="mt-4 bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
                                {(['renter', 'owner', 'agent'] as UserRole[]).map((r) => (
                                    <TouchableOpacity
                                        key={r}
                                        onPress={() => handleRoleSwitch(r)}
                                        className={`p-3 rounded-xl flex-row items-center justify-between ${role === r ? 'bg-orange-50' : ''}`}
                                    >
                                        <Text className={`font-outfit-medium ${role === r ? 'text-orange-600' : 'text-slate-600'}`}>{roleLabels[r]}</Text>
                                        {role === r && <View className="w-2 h-2 rounded-full bg-orange-500" />}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Menu Items */}
                    <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
                        {/* Pinned Section */}
                        {pinnedPages.length > 0 && (
                            <View className="mb-6">
                                <Text className="text-[10px] font-outfit-bold text-slate-400 uppercase tracking-widest mb-3 ml-4">Pinned Shortcuts</Text>
                                {pinnedPages.map((page, index) => (
                                    <TouchableOpacity
                                        key={`pinned-${page.id}`}
                                        onPress={() => handleNavigate(page.href, page.label)}
                                        className="flex-row items-center py-3 px-4 rounded-2xl mb-2 bg-orange-50/50 border border-orange-100"
                                    >
                                        <Pin size={18} color="#F97316" className="mr-3" />
                                        <Text className="flex-1 text-sm font-outfit-bold text-orange-600">{page.label}</Text>
                                        <ChevronRight size={14} color="#FDBA74" />
                                    </TouchableOpacity>
                                ))}
                                <View className="h-[1px] bg-slate-100 mx-4 my-2" />
                            </View>
                        )}

                        <Text className="text-[10px] font-outfit-bold text-slate-400 uppercase tracking-widest mb-3 ml-4">Account Navigator</Text>
                        {menuItems.map((item: any, index: number) => {
                            const Icon = item.icon;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleNavigate(item.href, item.label)}
                                    className="flex-row items-center py-3 px-4 rounded-2xl mb-3 active:bg-slate-100"
                                >
                                    <Icon size={20} color={index === 0 ? '#F97316' : '#64748B'} className="mr-3" />
                                    <Text className={`flex-1 text-sm font-outfit-medium ${index === 0 ? 'text-orange-600' : 'text-slate-700'}`}>{item.label}</Text>
                                    <ChevronRight size={14} color="#CBD5E1" />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Footer */}
                    <View
                        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
                        className="p-6 border-t border-slate-50"
                    >
                        <TouchableOpacity
                            onPress={handleSignOut}
                            className="flex-row items-center justify-center bg-white py-4 rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                        >
                            <LogOut size={20} color="#EF4444" className="mr-3" />
                            <Text className="text-base font-outfit-bold text-red-500">SIGN OUT</Text>
                        </TouchableOpacity>
                        <Text className="text-center text-slate-400 text-[10px] mt-4 font-outfit">Leli Mobile v1.0.0</Text>
                    </View>
                </Animated.View>
                <Pressable
                    onPress={onClose}
                    className="flex-1 bg-slate-900/40"
                />
            </View>
        </Modal>
    );
}
