import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, FileText } from 'lucide-react-native';
import { useAuth } from '../../context/auth-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function EditProfileScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [form, setForm] = useState({
        full_name: user?.user_metadata?.full_name || '',
        phone: user?.phone || user?.user_metadata?.phone || '',
        bio: user?.user_metadata?.bio || '',
        next_of_kin_name: '',
        next_of_kin_phone: '',
        next_of_kin_relation: '',
    });

    React.useEffect(() => {
        async function fetchProfile() {
            if (!user?.id) return;
            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('full_name, bio, phone_number, next_of_kin_name, next_of_kin_phone, next_of_kin_relation')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setForm(prev => ({
                        ...prev,
                        full_name: data.full_name || prev.full_name,
                        bio: data.bio || prev.bio,
                        phone: data.phone_number || prev.phone,
                        next_of_kin_name: data.next_of_kin_name || '',
                        next_of_kin_phone: data.next_of_kin_phone || '',
                        next_of_kin_relation: data.next_of_kin_relation || '',
                    }));
                }
            } catch (e) {
                // ignore error, default to auth metadata
            } finally {
                setFetching(false);
            }
        }
        fetchProfile();
    }, [user?.id]);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: form.full_name,
                    bio: form.bio,
                    phone: form.phone
                }
            });

            if (error) throw error;

            // Also update public profile table
            const { error: profileError } = await supabase
                .from('user_profiles')
                .update({
                    full_name: form.full_name,
                    bio: form.bio,
                    phone_number: form.phone,
                    next_of_kin_name: form.next_of_kin_name,
                    next_of_kin_phone: form.next_of_kin_phone,
                    next_of_kin_relation: form.next_of_kin_relation,
                })
                .eq('id', user?.id);

            if (profileError) throw profileError;

            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-6 py-4 flex-row items-center justify-between">
                    <BackButton />
                    <Text className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Edit Profile</Text>
                    <View className="w-10" />
                </View>

                <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
                    <Input
                        label="Full Name"
                        icon={<User size={20} color="#94a3b8" />}
                        value={form.full_name}
                        onChangeText={(text) => setForm({ ...form, full_name: text })}
                    />

                    <Input
                        label="Phone Number"
                        icon={<Phone size={20} color="#94a3b8" />}
                        value={form.phone}
                        onChangeText={(text) => setForm({ ...form, phone: text })}
                        keyboardType="phone-pad"
                    />

                    {/* Email is typically read-only or handled via separate flow */}
                    <Input
                        label="Email Address"
                        icon={<Mail size={20} color="#94a3b8" />}
                        value={user?.email || ''}
                        editable={false}
                        containerClassName="opacity-60"
                        className="text-slate-500"
                    />

                    <Input
                        label="Bio"
                        icon={<FileText size={20} color="#94a3b8" />}
                        value={form.bio}
                        onChangeText={(text) => setForm({ ...form, bio: text })}
                        multiline
                        numberOfLines={4}
                        className="h-24 py-3"
                    />

                    <View className="h-4" />
                    <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">Next of Kin</Text>

                    <Input
                        label="Next of Kin Name"
                        icon={<User size={20} color="#94a3b8" />}
                        value={form.next_of_kin_name}
                        onChangeText={(text) => setForm({ ...form, next_of_kin_name: text })}
                        placeholder="Name of contact"
                    />

                    <Input
                        label="Relation"
                        icon={<User size={20} color="#94a3b8" />}
                        value={form.next_of_kin_relation}
                        onChangeText={(text) => setForm({ ...form, next_of_kin_relation: text })}
                        placeholder="e.g. Spouse, Parent, Sibling"
                    />

                    <Input
                        label="Next of Kin Phone"
                        icon={<Phone size={20} color="#94a3b8" />}
                        value={form.next_of_kin_phone}
                        onChangeText={(text) => setForm({ ...form, next_of_kin_phone: text })}
                        keyboardType="phone-pad"
                    />

                    <Button
                        title="Save Changes"
                        onPress={handleUpdate}
                        isLoading={loading}
                        className="mt-6"
                    />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
