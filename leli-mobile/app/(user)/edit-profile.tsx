import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, User, Mail, Phone, MapPin, Shield, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import ScreenBackground from '../../components/ui/ScreenBackground';
import BackButton from '../../components/ui/BackButton';
import { useNotifications } from '../../context/NotificationContext';
import { useUser } from '../../context/UserContext';

const SafeAreaView = styled(SafeAreaViewContext);

export default function EditProfileScreen() {
    const { addNotification } = useNotifications();
    const { userName, email: currentEmail, phone: currentPhone, location: currentLocation, updateProfile } = useUser();

    const [name, setName] = useState(userName);
    const [email, setEmail] = useState(currentEmail);
    const [phone, setPhone] = useState(currentPhone);
    const [location, setLocation] = useState(currentLocation);

    const handleSave = () => {
        updateProfile({
            userName: name,
            email,
            phone,
            location
        });

        addNotification({
            title: 'Profile Updated',
            description: 'Your changes have been saved successfully.',
            type: 'success',
            iconName: 'User',
        });
        router.back();
    };

    return (
        <View className="flex-1">
            <ScreenBackground />
            <SafeAreaView className="flex-1 px-6 pt-4">
                <BackButton label="Edit Profile" />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    <View className="items-center mb-8">
                        <View className="w-28 h-28 bg-white rounded-full items-center justify-center relative shadow-lg">
                            <View className="w-24 h-24 bg-slate-800 rounded-full" />
                            <TouchableOpacity className="absolute bottom-0 right-0 bg-orange-500 w-10 h-10 rounded-full items-center justify-center border-4 border-white">
                                <Camera size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="space-y-6">
                        <View>
                            <Text className="text-slate-500 font-outfit-medium text-xs uppercase tracking-widest mb-2 ml-1">Full Name</Text>
                            <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 shadow-sm">
                                <User size={20} color="#94A3B8" />
                                <TextInput
                                    className="flex-1 ml-3 font-outfit text-slate-800 text-base"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-500 font-outfit-medium text-xs uppercase tracking-widest mb-2 ml-1">Email Address</Text>
                            <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 shadow-sm">
                                <Mail size={20} color="#94A3B8" />
                                <TextInput
                                    className="flex-1 ml-3 font-outfit text-slate-800 text-base"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-500 font-outfit-medium text-xs uppercase tracking-widest mb-2 ml-1">Phone Number</Text>
                            <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 shadow-sm">
                                <Phone size={20} color="#94A3B8" />
                                <TextInput
                                    className="flex-1 ml-3 font-outfit text-slate-800 text-base"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-slate-500 font-outfit-medium text-xs uppercase tracking-widest mb-2 ml-1">Location</Text>
                            <View className="flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 shadow-sm">
                                <MapPin size={20} color="#94A3B8" />
                                <TextInput
                                    className="flex-1 ml-3 font-outfit text-slate-800 text-base"
                                    value={location}
                                    onChangeText={setLocation}
                                />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleSave}
                        className="mt-10 bg-slate-900 py-5 rounded-2xl items-center flex-row justify-center shadow-lg"
                    >
                        <Check size={20} color="white" className="mr-2" />
                        <Text className="text-white font-outfit-bold text-lg">Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
