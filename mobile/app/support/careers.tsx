import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, MapPin, Clock, ChevronRight, Heart, Globe, Zap } from 'lucide-react-native';
import { MotiView } from 'moti';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackButton } from '@/components/ui/back-button';
import { openPositions, benefits } from '../../lib/careers-data';
import { GlassView } from '@/components/ui/glass-view';
import { useTheme } from '@/components/theme-provider';

export default function CareersScreen() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? '#020617' : 'white' }}>
            <BackgroundGradient />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center' }}>
                    <BackButton />
                    <View style={{ marginLeft: 16 }}>
                        <Text style={{ fontSize: 24, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>Careers</Text>
                        <Text style={{ fontSize: 10, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>Join the Mission</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Hero Section */}
                    <View style={{ paddingHorizontal: 24, paddingVertical: 32 }}>
                        <Text style={{ fontSize: 32, fontWeight: '900', color: isDark ? 'white' : '#0f172a', lineHeight: 40 }}>
                            Build the future of <Text style={{ color: '#3b82f6' }}>rentals</Text> in Africa.
                        </Text>
                        <Text style={{ color: '#94a3b8', fontSize: 16, fontWeight: '700', marginTop: 16, lineHeight: 24 }}>
                            Help us transform how people access what they need. We're looking for passionate pioneers.
                        </Text>
                    </View>

                    {/* Benefits Section */}
                    <View style={{ paddingHorizontal: 24, marginBottom: 48 }}>
                        <Text style={{ fontSize: 18, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 24 }}>Why Leli?</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                            {benefits.map((b, i) => (
                                <GlassView key={i} intensity={10} tint={isDark ? 'dark' : 'light'} style={{ width: '100%', padding: 20, borderRadius: 24, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#3b82f615', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                        {i === 0 && <Heart size={20} color="#3b82f6" />}
                                        {i === 1 && <Globe size={20} color="#3b82f6" />}
                                        {i === 2 && <Zap size={20} color="#3b82f6" />}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: isDark ? 'white' : '#0f172a', fontWeight: '900', fontSize: 14 }}>{b.title}</Text>
                                        <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '700', marginTop: 2 }}>{b.description}</Text>
                                    </View>
                                </GlassView>
                            ))}
                        </View>
                    </View>

                    {/* Open Positions */}
                    <View style={{ paddingHorizontal: 24 }}>
                        <Text style={{ fontSize: 18, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 24 }}>Open Positions</Text>
                        {openPositions.map((job, idx) => (
                            <MotiView
                                key={job.id}
                                from={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 100 }}
                                style={{ marginBottom: 16 }}
                            >
                                <TouchableOpacity>
                                    <GlassView intensity={15} tint={isDark ? 'dark' : 'light'} style={{ padding: 24, borderRadius: 28 }}>
                                        <Text style={{ color: isDark ? 'white' : '#0f172a', fontWeight: '900', fontSize: 18, marginBottom: 12 }}>{job.title}</Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Briefcase size={12} color="#94a3b8" />
                                                <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '800', marginLeft: 6 }}>{job.department}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <MapPin size={12} color="#94a3b8" />
                                                <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '800', marginLeft: 6 }}>{job.location}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Clock size={12} color="#94a3b8" />
                                                <Text style={{ color: '#94a3b8', fontSize: 11, fontWeight: '800', marginLeft: 6 }}>{job.type}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                                            <View style={{ backgroundColor: '#10b98115', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                                                <Text style={{ color: '#10b981', fontSize: 10, fontWeight: '900' }}>{job.salary}</Text>
                                            </View>
                                            <ChevronRight size={18} color="#94a3b8" />
                                        </View>
                                    </GlassView>
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
