import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Image, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { PerspectiveView } from '@/components/ui/perspective-view';
import { GlassView } from '@/components/ui/glass-view';
import { ChevronRight, Shield, Zap, Star } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        title: "Rent Premium\nEverything",
        desc: "From off-road 4x4s to high-end photography gear, fuel your passion without the price tag.",
        image: require('../assets/images/leli-home-hero-corrected.jpg'),
        icon: Star,
        color: "#f97316"
    },
    {
        title: "Secured by\nEscrow",
        desc: "Rent with confidence. Payments are only released once the item is in your hands.",
        image: require('../assets/images/leli-home-hero-corrected.jpg'), // Fallback high-res
        icon: Shield,
        color: "#10b981"
    },
    {
        title: "Earn Extra\nIncome",
        desc: "Turn your idle equipment and vehicles into a profit-generating machine today.",
        image: require('../assets/images/leli-home-hero-corrected.jpg'),
        icon: Zap,
        color: "#3b82f6"
    }
];

export default function OnboardingScreen() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (currentSlide < SLIDES.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            router.replace('/(tabs)');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar barStyle="light-content" translucent />

            <AnimatePresence exitBeforeEnter>
                <MotiView
                    key={currentSlide}
                    from={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'timing', duration: 1500 }}
                    style={StyleSheet.absoluteFillObject}
                >
                    <Image
                        source={SLIDES[currentSlide].image}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
                        style={StyleSheet.absoluteFillObject}
                    />
                </MotiView>
            </AnimatePresence>

            {/* Content Overlay */}
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 60, paddingHorizontal: 32 }}>

                    <AnimatePresence exitBeforeEnter>
                        <MotiView
                            key={currentSlide}
                            from={{ opacity: 0, translateY: 40 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            exit={{ opacity: 0, translateY: -20 }}
                            transition={{ type: 'spring', damping: 15 }}
                        >
                            <PerspectiveView floatEnabled={true} style={{ marginBottom: 24 }}>
                                <View style={{ height: 64, width: 64, borderRadius: 24, backgroundColor: `${SLIDES[currentSlide].color}20`, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: `${SLIDES[currentSlide].color}50` }}>
                                    {React.createElement(SLIDES[currentSlide].icon, { size: 32, color: SLIDES[currentSlide].color })}
                                </View>
                            </PerspectiveView>

                            <Text style={{ fontSize: 44, fontWeight: '900', color: 'white', lineHeight: 52, marginBottom: 16 }}>
                                {SLIDES[currentSlide].title}
                            </Text>
                            <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', fontWeight: '700', lineHeight: 28, marginBottom: 48 }}>
                                {SLIDES[currentSlide].desc}
                            </Text>
                        </MotiView>
                    </AnimatePresence>

                    {/* Footer Controls */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Pagination Dots */}
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            {SLIDES.map((_, i) => (
                                <MotiView
                                    key={i}
                                    animate={{
                                        width: i === currentSlide ? 32 : 8,
                                        backgroundColor: i === currentSlide ? '#f97316' : 'rgba(255,255,255,0.3)'
                                    }}
                                    style={{ height: 8, borderRadius: 4 }}
                                />
                            ))}
                        </View>

                        <TouchableOpacity onPress={handleNext}>
                            <GlassView intensity={40} tint="dark" style={{ height: 72, width: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' }}>
                                <ChevronRight size={32} color="white" />
                            </GlassView>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

// Minimal placeholder so imports don't break during write
import { SafeAreaView } from 'react-native-safe-area-context';
