import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Key, Users, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../context/auth-context';

type UserRole = 'renter' | 'owner' | 'affiliate';

export default function SelectRoleScreen() {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const roles = [
        {
            id: 'renter',
            title: 'Renter',
            description: 'I want to rent high-quality gear and equipment.',
            icon: ShoppingBag,
            color: '#f97316',
            bgColor: 'bg-orange-50',
            darkBgColor: 'dark:bg-orange-900/20'
        },
        {
            id: 'owner',
            title: 'Lender / Owner',
            description: 'I have items I want to list for rent and earn money.',
            icon: Key,
            color: '#10b981',
            bgColor: 'bg-emerald-50',
            darkBgColor: 'dark:bg-emerald-900/20'
        },
        {
            id: 'affiliate',
            title: 'Affiliate',
            description: 'I want to refer others and earn commissions.',
            icon: Users,
            color: '#a855f7',
            bgColor: 'bg-purple-50',
            darkBgColor: 'dark:bg-purple-900/20'
        }
    ];

    const handleContinue = async () => {
        if (!selectedRole || !user) return;

        setLoading(true);
        try {
            // 1. Update user metadata in Auth
            const { error: authError } = await supabase.auth.updateUser({
                data: { role: selectedRole }
            });

            if (authError) throw authError;

            // 2. Update user_profiles table
            const updateData: any = { role: selectedRole };

            // If selecting owner, set the owner_at timestamp for verification grace period
            if (selectedRole === 'owner') {
                updateData.owner_at = new Date().toISOString();
            }

            const { error: profileError } = await supabase
                .from('user_profiles')
                .update(updateData)
                .eq('id', user.id);

            // 3. If selecting affiliate, ensure record exists in affiliates table
            if (selectedRole === 'affiliate') {
                // Check if already exists first to avoid conflict
                const { data: existingAff } = await supabase
                    .from('affiliates')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();

                if (!existingAff) {
                    const inviteCode = `MOB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                    const referralCode = `${user.user_metadata?.full_name?.split(' ')[0] || 'USER'}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

                    await supabase.from('affiliates').insert({
                        user_id: user.id,
                        email: user.email,
                        invite_code: inviteCode,
                        referral_code: referralCode,
                        status: 'active', // Assuming mobile signup grants active status like web
                    });
                }
            }

            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error updating role:', error);
            // Fallback redirect
            router.replace('/(tabs)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <View className="mt-12 mb-10">
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 800 }}
                        >
                            <Text className="text-4xl font-black text-slate-900 dark:text-white mb-4">Choose Your Path</Text>
                            <Text className="text-slate-500 dark:text-slate-400 font-bold text-lg leading-6">
                                Select how you want to use Leli Rentals. You can always change this later in your dashboard.
                            </Text>
                        </MotiView>
                    </View>

                    <View className="gap-4">
                        {roles.map((role, idx) => {
                            const isSelected = selectedRole === role.id;
                            return (
                                <MotiView
                                    key={role.id}
                                    from={{ opacity: 0, translateX: -20 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ delay: 200 + (idx * 100) }}
                                >
                                    <TouchableOpacity
                                        onPress={() => setSelectedRole(role.id as UserRole)}
                                        className={`p-6 rounded-[32px] border-2 flex-row items-center bg-white/80 dark:bg-slate-900/80 ${isSelected ? 'border-[#f97316]' : 'border-slate-50 dark:border-slate-800'}`}
                                    >
                                        <View className={`h-16 w-16 rounded-[20px] ${role.bgColor} ${role.darkBgColor} items-center justify-center mr-6`}>
                                            <role.icon size={28} color={role.color} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-xl font-black text-slate-900 dark:text-white mb-1">{role.title}</Text>
                                            <Text className="text-slate-500 text-sm font-bold leading-5">{role.description}</Text>
                                        </View>
                                        {isSelected && (
                                            <MotiView from={{ scale: 0 }} animate={{ scale: 1 }}>
                                                <CheckCircle2 size={24} color="#f97316" />
                                            </MotiView>
                                        )}
                                    </TouchableOpacity>
                                </MotiView>
                            );
                        })}
                    </View>

                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 600 }}
                        className="mt-12"
                    >
                        <Button
                            title="Continue to Dashboard"
                            onPress={handleContinue}
                            disabled={!selectedRole || loading}
                            loading={loading}
                            icon={<ArrowRight size={20} color="white" />}
                        />
                    </MotiView>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
