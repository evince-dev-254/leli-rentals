import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export type AlertType = 'success' | 'error' | 'info';

interface BrandedAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type?: AlertType;
    onClose: () => void;
}

export const BrandedAlert = ({ visible, title, message, type = 'info', onClose }: BrandedAlertProps) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle color="#4ade80" size={32} />;
            case 'error': return <AlertCircle color="#ef4444" size={32} />;
            default: return <Info color="#fb923c" size={32} />;
        }
    };

    const getPrimaryColor = () => {
        switch (type) {
            case 'success': return '#4ade80';
            case 'error': return '#ef4444';
            default: return '#fb923c';
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <AnimatePresence>
                    {visible && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.9, translateY: 20 }}
                            animate={{ opacity: 1, scale: 1, translateY: 0 }}
                            exit={{ opacity: 0, scale: 0.9, translateY: 20 }}
                            transition={{ type: 'timing', duration: 300 }}
                            style={styles.container}
                        >
                            <View className="items-center mb-4">
                                {getIcon()}
                            </View>

                            <Text className="text-xl font-black text-white text-center mb-2">{title}</Text>

                            <View style={{ maxHeight: height * 0.4 }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text className="text-slate-400 text-center mb-6 leading-6 text-base">{message}</Text>
                                </ScrollView>
                            </View>

                            <TouchableOpacity
                                onPress={onClose}
                                style={[styles.button, { backgroundColor: getPrimaryColor() }]}
                                className="h-12 rounded-2xl items-center justify-center shadow-lg"
                            >
                                <Text className="text-white font-black text-base uppercase tracking-widest">OK</Text>
                            </TouchableOpacity>
                        </MotiView>
                    )}
                </AnimatePresence>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker overlay for better glass contrast
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    container: {
        width: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.8)', // slate-900/80
        borderRadius: 24, // 24px outer radius
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    button: {
        width: '100%',
        borderRadius: 12, // 12px inner radius
    }
});
