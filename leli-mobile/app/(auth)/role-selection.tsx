import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { User, Home, Wrench, ShieldCheck, ChevronRight } from 'lucide-react-native';
import { useUser, UserRole } from '../../context/UserContext';
import ScreenBackground from '../../components/ui/ScreenBackground';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const SafeAreaView = styled(SafeAreaViewContext);

export default function RoleSelectionScreen() {
    const { switchRole } = useUser();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    const roles: { id: UserRole; title: string, icon: any, description: string }[] = [
        { id: 'renter', title: 'I am a Renter', icon: User, description: 'Find and book premium stays' },
        { id: 'owner', title: 'I am an Owner', icon: Home, description: 'List and manage your properties' },
        { id: 'agent', title: 'I am an Affiliate', icon: ShieldCheck, description: 'Earn by referring properties' },
    ];

    const handleContinue = () => {
        if (selectedRole) {
            switchRole(selectedRole);
            router.replace('/(tabs)');
        }
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-8 pt-8">
                <Animated.View
                    entering={FadeInDown.delay(200).duration(800)}
                    className="mb-10"
                >
                    <Image
                        source={require('../../assets/images/logo.png')}
                        className="h-8 w-24 mb-8"
                        resizeMode="contain"
                    />
                    <Text className="text-[34px] font-outfit-bold text-slate-900 mb-2 leading-[42px]">Choose your role</Text>
                    <Text className="text-lg font-outfit text-slate-500">
                        How do you plan to use Leli Rentals?
                    </Text>
                </Animated.View>

                <View className="space-y-4">
                    {roles.map((role, index) => (
                        <Animated.View
                            key={role.id}
                            entering={FadeInUp.delay(400 + index * 100).duration(800)}
                        >
                            <TouchableOpacity
                                onPress={() => setSelectedRole(role.id)}
                                activeOpacity={0.8}
                                className={`flex-row items-center p-5 rounded-[32px] border-2 transition-all duration-300 ${selectedRole === role.id
                                    ? 'border-orange-500 bg-white shadow-xl shadow-orange-100'
                                    : 'border-slate-50 bg-white/60'
                                    }`}
                            >
                                <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${selectedRole === role.id ? 'bg-orange-500' : 'bg-slate-100'
                                    }`}>
                                    <role.icon size={26} color={selectedRole === role.id ? 'white' : '#64748B'} strokeWidth={2} />
                                </View>
                                <View className="flex-1">
                                    <Text className={`text-lg font-outfit-bold ${selectedRole === role.id ? 'text-slate-900' : 'text-slate-700'
                                        }`}>
                                        {role.title}
                                    </Text>
                                    <Text className="text-sm font-outfit text-slate-400">{role.description}</Text>
                                </View>
                                {selectedRole === role.id ? (
                                    <View className="w-6 h-6 rounded-full bg-orange-500 items-center justify-center">
                                        <View className="w-2.5 h-2.5 rounded-full bg-white" />
                                    </View>
                                ) : (
                                    <View className="w-6 h-6 rounded-full border-2 border-slate-200" />
                                )}
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                <View className="flex-1 justify-end pb-10">
                    <Animated.View entering={FadeInUp.delay(800).duration(800)}>
                        <TouchableOpacity
                            onPress={handleContinue}
                            disabled={!selectedRole}
                            activeOpacity={0.9}
                            className={`py-5 rounded-[24px] flex-row items-center justify-center space-x-2 ${selectedRole ? 'bg-slate-900 shadow-2xl shadow-slate-300' : 'bg-slate-200'
                                }`}
                        >
                            <Text className={`font-outfit-bold text-lg uppercase tracking-wider ${selectedRole ? 'text-white' : 'text-slate-400'}`}>
                                Continue
                            </Text>
                            {selectedRole && <ChevronRight size={20} color="white" />}
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </SafeAreaView>
        </View>
    );
}
