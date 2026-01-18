import React, { useState } from 'react';
import { View, Image, Text, Alert, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/button';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Upload, CheckCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';

interface OCRResult {
    raw_text: string;
    extracted_id: string | null;
    extracted_dates: string[];
    lines: string[];
}

interface OCRResponse {
    status: 'success' | 'error';
    data?: OCRResult;
    message?: string;
}

export default function VerifyIdScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<OCRResult | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Cropping helps OCR accuracy!
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setResult(null); // Reset previous result
        }
    };

    const handleVerify = async () => {
        if (!image) return;

        setLoading(true);
        setResult(null);

        // NOTE: For Android Emulator use '10.0.2.2' instead of 'localhost'
        // For physical device, use your computer's local IP address e.g., http://192.168.1.5:8000
        const apiUrl = 'http://10.0.2.2:8000/verify-id';

        const formData = new FormData();

        // React Native specific file object construction
        formData.append('file', {
            uri: image,
            name: 'id_card.jpg',
            type: 'image/jpeg',
        } as any);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data: OCRResponse = await response.json();

            if (data.status === 'success' && data.data) {
                setResult(data.data);
            } else {
                Alert.alert('Analysis Failed', data.message || 'Could not process image');
            }
        } catch (error) {
            console.error(error);
            Alert.alert(
                'Connection Error',
                'Could not connect to OCR service. \n\nEnsure:\n1. The Python service is running.\n2. You are using the correct IP (10.0.2.2 for emulator).'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#fffdf0] dark:bg-slate-950">
            <BackgroundGradient />
            <SafeAreaView className="flex-1">
                <View className="px-8 py-4">
                    <BackButton />
                </View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 32, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    <Text className="text-4xl font-black text-slate-900 dark:text-white mb-2">ID Verification</Text>
                    <Text className="text-slate-500 dark:text-slate-400 font-bold mb-8">Upload a clear photo of your ID card for verification.</Text>

                    <TouchableOpacity onPress={pickImage} className="w-full h-56 bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border-2 border-slate-100 dark:border-slate-800 border-dashed items-center justify-center mb-8">
                        {image ? (
                            <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" alt="ID Card Preview" />
                        ) : (
                            <View className="items-center">
                                <View className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-2xl items-center justify-center mb-4">
                                    <Upload size={32} color="#f97316" />
                                </View>
                                <Text className="text-slate-400 font-bold">Tap to select image</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Button
                        title="Verify ID"
                        onPress={handleVerify}
                        disabled={!image}
                        loading={loading}
                        className="h-16 rounded-[28px]"
                    />

                    {result && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 bg-white/80 dark:bg-slate-900/80 p-8 rounded-[32px] border-2 border-emerald-100 dark:border-emerald-900/20 shadow-sm"
                        >
                            <View className="flex-row items-center mb-6">
                                <CheckCircle size={24} color="#10b981" />
                                <Text className="text-xl font-black text-slate-900 dark:text-white ml-2">Verified</Text>
                            </View>

                            <View className="mb-4">
                                <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID Number</Text>
                                <Text className="text-lg font-black text-slate-900 dark:text-white">{result.extracted_id || "Not detected"}</Text>
                            </View>

                            {result.extracted_dates.length > 0 && (
                                <View className="mb-6">
                                    <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dates Detected</Text>
                                    <Text className="text-base font-bold text-slate-900 dark:text-white">{result.extracted_dates.join(", ")}</Text>
                                </View>
                            )}

                            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Technical Summary</Text>
                            <View className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                                <Text className="text-[8px] font-mono text-slate-500 leading-3">{result.raw_text}</Text>
                            </View>
                        </MotiView>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    uploadArea: {
        width: '100%',
        height: 200,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 10,
        color: '#9BA1A6',
    },
    buttonContainer: {
        marginBottom: 20,
    },
    resultContainer: {
        backgroundColor: '#f0fdf4',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#15803d',
        marginLeft: 8,
    },
    resultDetails: {
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    value: {
        fontSize: 16,
        color: '#111827',
    },
    rawTextHeader: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 12,
        marginBottom: 4,
    },
    rawText: {
        fontSize: 10,
        fontFamily: 'monospace',
        color: '#374151',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 4,
    },
});
