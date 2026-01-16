import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, MapPin, Tag, CircleDollarSign, ShieldCheck, ChevronRight, ChevronLeft, Plus, X, Sparkles, Check } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/lib/hooks/useData';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { cn } from '@/lib/utils';

const STEPS = [
    { title: "Basics", icon: Tag },
    { title: "Pricing", icon: CircleDollarSign },
    { title: "Location", icon: MapPin },
    { title: "Details", icon: Sparkles },
    { title: "Media", icon: Camera },
];

export default function CreateListingScreen() {
    const router = useRouter();
    const { data: categories, isLoading: catsLoading } = useCategories();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [priceDay, setPriceDay] = useState('');
    const [priceWeek, setPriceWeek] = useState('');
    const [priceMonth, setPriceMonth] = useState('');
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const [amenities, setAmenities] = useState<string[]>([]);
    const [newAmenity, setNewAmenity] = useState('');
    const [images, setImages] = useState<string[]>([]);

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleCreate();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const pickImage = async () => {
        if (images.length >= 5) {
            Alert.alert("Limit Reached", "You can upload up to 5 images.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            setImages([...images, result.assets[0].uri]);
        }
    };

    const addAmenity = () => {
        if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
            setAmenities([...amenities, newAmenity.trim()]);
            setNewAmenity('');
        }
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Mock success for now, in a real app we'd upload images and then create the listing
            setTimeout(() => {
                setLoading(false);
                Alert.alert("Success", "Your listing has been created and is pending review!", [
                    { text: "Awesome", onPress: () => router.replace('/(tabs)/dashboard') }
                ]);
            }, 2000);

        } catch (error: any) {
            setLoading(false);
            Alert.alert("Error", error.message);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} className="space-y-6">
                        <Input label="Listing Title" placeholder="e.g. Sony A7IV Camera" value={title} onChangeText={setTitle} />
                        <Input label="Description" placeholder="Tell us about your gear..." value={description} onChangeText={setDescription} multiline numberOfLines={4} className="h-32 pt-4" />
                        <View className="mb-4">
                            <Text className="text-slate-900 dark:text-white font-black mb-3">Category</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {catsLoading ? <ActivityIndicator /> : categories?.map((cat: any) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => setCategoryId(cat.id)}
                                        className={cn(
                                            "px-6 py-3 rounded-2xl border-2",
                                            categoryId === cat.id ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/20" : "bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800"
                                        )}
                                    >
                                        <Text className={cn("font-black text-xs", categoryId === cat.id ? "text-white" : "text-slate-500")}>{cat.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </MotiView>
                );
            case 1:
                return (
                    <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} className="space-y-6">
                        <Input label="Price per Day (KES)" placeholder="0" value={priceDay} onChangeText={setPriceDay} keyboardType="numeric" />
                        <Input label="Price per Week (KES)" placeholder="Optional" value={priceWeek} onChangeText={setPriceWeek} keyboardType="numeric" />
                        <Input label="Price per Month (KES)" placeholder="Optional" value={priceMonth} onChangeText={setPriceMonth} keyboardType="numeric" />
                    </MotiView>
                );
            case 2:
                return (
                    <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} className="space-y-6">
                        <Input label="City / County" placeholder="e.g. Nairobi" value={city} onChangeText={setCity} />
                        <Input label="Area / Neighborhood" placeholder="e.g. Westlands" value={area} onChangeText={setArea} />
                        <View className="h-40 bg-slate-100 dark:bg-slate-900 rounded-[32px] items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <MapPin size={32} color="#94a3b8" />
                            <Text className="text-slate-400 font-bold mt-2">Map selection coming soon</Text>
                        </View>
                    </MotiView>
                );
            case 3:
                return (
                    <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} className="space-y-6">
                        <View className="flex-row gap-2">
                            <View className="flex-1">
                                <Input label="Add Features" placeholder="e.g. 4K Video" value={newAmenity} onChangeText={setNewAmenity} />
                            </View>
                            <TouchableOpacity onPress={addAmenity} className="mt-8 bg-blue-600 h-14 w-14 rounded-2xl items-center justify-center">
                                <Plus size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row flex-wrap gap-2 mt-4">
                            {amenities.map(a => (
                                <View key={a} className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl flex-row items-center">
                                    <Text className="text-slate-600 dark:text-slate-300 font-bold mr-2">{a}</Text>
                                    <TouchableOpacity onPress={() => setAmenities(amenities.filter(item => item !== a))}>
                                        <X size={14} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </MotiView>
                );
            case 4:
                return (
                    <MotiView from={{ opacity: 0, translateX: 50 }} animate={{ opacity: 1, translateX: 0 }} className="space-y-6">
                        <Text className="text-slate-500 font-bold mb-4">Add up to 5 photos of your gear.</Text>
                        <View className="flex-row flex-wrap gap-4">
                            {images.map((img, idx) => (
                                <View key={idx} className="h-24 w-24 rounded-2xl bg-slate-100 overflow-hidden relative">
                                    <Text className="m-auto text-xs text-slate-400 font-bold">Photo {idx + 1}</Text>
                                    <TouchableOpacity
                                        onPress={() => setImages(images.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 bg-red-500 h-6 w-6 rounded-full items-center justify-center"
                                    >
                                        <X size={14} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {images.length < 5 && (
                                <TouchableOpacity onPress={pickImage} className="h-24 w-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 items-center justify-center">
                                    <Camera size={24} color="#94a3b8" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </MotiView>
                );
        }
    };

    return (
        <View className="flex-1 bg-[#fffdf0] dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4 flex-row items-center justify-between">
                    <BackButton />
                    <View className="items-end">
                        <Text className="text-xl font-black text-slate-900 dark:text-white">List Your Gear</Text>
                        <Text className="text-xs text-blue-600 font-black">Step {currentStep + 1} of 5</Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View className="px-8 mt-4 flex-row gap-1">
                    {STEPS.map((_, idx) => (
                        <View key={idx} className={cn("h-1 flex-1 rounded-full", idx <= currentStep ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800")} />
                    ))}
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ padding: 32 }} showsVerticalScrollIndicator={false}>
                    <View className="mb-8">
                        <Text className="text-3xl font-black text-slate-900 dark:text-white">{STEPS[currentStep].title}</Text>
                    </View>

                    {renderStep()}

                    <View className="h-20" />
                </ScrollView>

                {/* Fixed Bottom Navigation */}
                <View className="absolute bottom-0 left-0 right-0 p-8 pt-4 bg-[#fffdf0]/90 dark:bg-slate-950/90 border-t border-slate-100 dark:border-slate-800 flex-row gap-4">
                    {currentStep > 0 && (
                        <TouchableOpacity onPress={prevStep} className="h-16 w-16 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-50 dark:border-slate-800 items-center justify-center">
                            <ChevronLeft size={24} color="#64748b" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={nextStep}
                        disabled={loading}
                        className="flex-1 h-16 bg-blue-600 rounded-3xl items-center justify-center flex-row shadow-lg shadow-blue-500/30"
                    >
                        {loading ? <ActivityIndicator color="white" /> : (
                            <>
                                <Text className="text-white text-lg font-black mr-2">
                                    {currentStep === STEPS.length - 1 ? "Finish & Post" : "Next Step"}
                                </Text>
                                {currentStep === STEPS.length - 1 ? <Check size={20} color="white" /> : <ChevronRight size={20} color="white" />}
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}
