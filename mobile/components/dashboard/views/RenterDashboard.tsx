import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ShoppingBag, Heart, Calendar, ChevronRight, Sparkles, Star } from 'lucide-react-native';
import { MotiView } from 'moti';
import { PerspectiveView } from '@/components/ui/perspective-view';
import { GlassView } from '@/components/ui/glass-view';
import { useTheme } from '@/components/theme-provider';

const StatCard = ({ label, value, icon: Icon, isDark }: any) => (
    <GlassView intensity={15} tint={isDark ? 'dark' : 'light'} style={{ flex: 1, padding: 24, borderRadius: 32, alignItems: 'center' }}>
        <PerspectiveView floatEnabled={true} style={{ marginBottom: 16 }}>
            <View style={{ height: 56, width: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.05)' }}>
                <Icon size={28} color="#f97316" strokeWidth={2.5} />
            </View>
        </PerspectiveView>
        <Text style={{ color: isDark ? 'white' : '#0f172a', fontSize: 24, fontWeight: '900' }}>{value}</Text>
        <Text style={{ color: '#94a3b8', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{label}</Text>
    </GlassView>
);

const WelcomeBanner = ({ name, isDark }: { name?: string, isDark: boolean }) => {
    return (
        <PerspectiveView style={{ marginBottom: 32 }}>
            <GlassView
                intensity={30}
                tint={isDark ? 'dark' : 'light'}
                style={{ padding: 32, borderRadius: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(249, 115, 22, 0.1)' }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 28, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 4 }}>Hello, {name || 'Explorer'}!</Text>
                    <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>Experience Premium v1.0.2</Text>
                </View>
                <View style={{ height: 60, width: 60, borderRadius: 24, backgroundColor: '#f97316', alignItems: 'center', justifyContent: 'center', shadowColor: '#f97316', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 12 }}>
                    <ShoppingBag size={28} color="white" strokeWidth={2.5} />
                </View>
            </GlassView>
        </PerspectiveView>
    );
};

export const RenterDashboardView = ({ router, user, stats }: any) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <WelcomeBanner name={user?.user_metadata?.full_name?.split(' ')[0]} isDark={isDark} />

            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
                <StatCard label="Orders" value={stats?.bookingCount || 0} icon={ShoppingBag} isDark={isDark} />
                <StatCard label="Saved" value={stats?.favoritesCount || 0} icon={Heart} isDark={isDark} />
            </View>

            <PerspectiveView style={{ marginBottom: 32 }}>
                <GlassView
                    intensity={40}
                    tint="dark"
                    style={{ padding: 32, borderRadius: 48, backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(15, 23, 42, 0.9)' }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                        <View>
                            <Text style={{ color: 'white', fontWeight: '900', fontSize: 20 }}>Market Trends</Text>
                            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 }}>Demand Insights</Text>
                        </View>
                        <GlassView intensity={10} tint="dark" style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 }}>
                            <Text style={{ color: '#f97316', fontWeight: '900', fontSize: 12 }}>+24% WOW</Text>
                        </GlassView>
                    </View>

                    <View style={{ height: 120, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        {[60, 40, 90, 70, 110, 85, 100].map((h, i) => (
                            <MotiView
                                key={i}
                                from={{ height: 0, opacity: 0 }}
                                animate={{ height: h, opacity: 1 }}
                                transition={{ delay: 500 + i * 100, type: 'spring' }}
                                style={{ width: 14, backgroundColor: '#f97316', borderRadius: 7, shadowColor: '#f97316', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 }}
                            />
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                            <Text key={i} style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '900', fontSize: 10 }}>{d}</Text>
                        ))}
                    </View>
                </GlassView>
            </PerspectiveView>

            <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>Curated Selection</Text>
                    <Sparkles size={16} color="#f97316" strokeWidth={3} />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingHorizontal: 4 }}>
                    {[1, 2, 3].map((i) => (
                        <TouchableOpacity key={i} onPress={() => router.push('/(tabs)')}>
                            <GlassView intensity={15} tint={isDark ? 'dark' : 'light'} style={{ width: 220, padding: 20, borderRadius: 36, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                <View style={{ height: 140, backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderRadius: 24, marginBottom: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    <ShoppingBag size={48} color={isDark ? '#334155' : '#cbd5e1'} strokeWidth={1.5} />
                                </View>
                                <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 6 }}>Elite Selection #{i}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#f97316', fontWeight: '900', fontSize: 14 }}>KES 2.5k<Text style={{ fontSize: 10, color: '#94a3b8' }}>/day</Text></Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
                                        <Star size={10} color="#f59e0b" fill="#f59e0b" />
                                        <Text style={{ color: isDark ? '#cbd5e1' : '#64748b', fontWeight: '900', fontSize: 10, marginLeft: 4 }}>5.0</Text>
                                    </View>
                                </View>
                            </GlassView>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>Secure Events</Text>
                    <TouchableOpacity onPress={() => router.push('/bookings')}>
                        <Text style={{ color: '#f97316', fontWeight: '900', fontSize: 12 }}>ACCESS LOG</Text>
                    </TouchableOpacity>
                </View>

                <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ borderRadius: 36, overflow: 'hidden' }}>
                    {[1, 2].map((i) => (
                        <TouchableOpacity key={i} style={{ padding: 24, borderBottomWidth: i === 1 ? 1 : 0, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ height: 48, width: 48, borderRadius: 16, backgroundColor: isDark ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                <Calendar size={20} color="#f97316" strokeWidth={2.5} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 15, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>Ecosystem Protocol #{i * 152}</Text>
                                <Text style={{ fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Active Timestamp • Ready</Text>
                            </View>
                            <ChevronRight size={18} color="#f97316" strokeWidth={3} />
                        </TouchableOpacity>
                    ))}
                </GlassView>
            </View>
        </ScrollView>
    );
};
