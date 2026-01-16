import React, { useState } from 'react';
import { View, Button, Image, Text, Alert, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react-native';

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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>ID Verification</Text>
                <Text style={styles.subtitle}>Upload a clear photo of your ID card for verification.</Text>

                <TouchableOpacity onPress={pickImage} style={styles.uploadArea}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.previewImage} resizeMode="contain" />
                    ) : (
                        <View style={styles.placeholder}>
                            <Upload size={40} color="#9BA1A6" />
                            <Text style={styles.placeholderText}>Tap to select image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    <Button
                        title={loading ? "Processing..." : "Verify ID"}
                        onPress={handleVerify}
                        disabled={!image || loading}
                    />
                </View>

                {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

                {result && (
                    <View style={styles.resultContainer}>
                        <View style={styles.resultHeader}>
                            <CheckCircle size={24} color="green" />
                            <Text style={styles.resultTitle}>Analysis Complete</Text>
                        </View>

                        <View style={styles.resultDetails}>
                            <Text style={styles.label}>ID Number Found:</Text>
                            <Text style={styles.value}>{result.extracted_id || "Not detected"}</Text>
                        </View>

                        {result.extracted_dates.length > 0 && (
                            <View style={styles.resultDetails}>
                                <Text style={styles.label}>Dates Found:</Text>
                                <Text style={styles.value}>{result.extracted_dates.join(", ")}</Text>
                            </View>
                        )}

                        <Text style={styles.rawTextHeader}>Raw Text Dump:</Text>
                        <Text style={styles.rawText}>{result.raw_text}</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
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
