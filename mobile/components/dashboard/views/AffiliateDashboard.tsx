import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Users, Wallet, BarChart3, Sparkles, Copy, Share2, Trophy, Target, ChevronRight, MousePointerClick } from 'lucide-react-native';
import { MotiView } from 'moti';
import { PerspectiveView } from '@/components/ui/perspective-view';
import { GlassView } from '@/components/ui/glass-view';
import { useTheme } from '@/components/theme-provider';

const StatCard = ({ label, value, icon: Icon, isDark }: any) => (
    <GlassView intensity={15} tint={isDark ? 'dark' : 'light'} style={{ flex: 1, padding: 24, borderRadius: 32, alignItems: 'center' }}>
        <PerspectiveView floatEnabled={true} style={{ marginBottom: 16 }}>
            <View style={{ height: 56, width: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)' }}>
                <Icon size={28} color="#a855f7" strokeWidth={2.5} />
            </View>
        </PerspectiveView>
        <Text style={{ color: isDark ? 'white' : '#0f172a', fontSize: 20, fontWeight: '900', textAlign: 'center' }}>{value}</Text>
        <Text style={{ color: '#94a3b8', fontSize: 9, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{label}</Text>
    </GlassView>
);

const WelcomeBanner = ({ name, isDark }: { name?: string, isDark: boolean }) => {
    return (
        <PerspectiveView style={{ marginBottom: 32 }}>
            <GlassView
                intensity={30}
                tint={isDark ? 'dark' : 'light'}
                style={{ padding: 32, borderRadius: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(168, 85, 247, 0.1)' }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 28, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 4 }}>Hey, {name || 'Partner'}!</Text>
                    <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>Expanding the Network</Text>
                </View>
                <View style={{ height: 60, width: 60, borderRadius: 24, backgroundColor: '#a855f7', alignItems: 'center', justifyContent: 'center', shadowColor: '#a855f7', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 12 }}>
                    <Users size={28} color="white" strokeWidth={2.5} />
                </View>
            </GlassView>
        </PerspectiveView>
    );
};

export const AffiliateDashboardView = ({ router, user, stats }: any) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <WelcomeBanner name={user?.user_metadata?.full_name?.split(' ')[0]} isDark={isDark} />

            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
                <StatCard label="Total Vol" value={`KSh ${stats?.affiliateEarnings || 0}`} icon={Trophy} isDark={isDark} />
                <StatCard label="Network" value={stats?.referralCount || 0} icon={Users} isDark={isDark} />
            </View>

            {/* Performance Analytics - Glass Hub */}
            <PerspectiveView style={{ marginBottom: 32 }}>
                <GlassView
                    intensity={20}
                    tint={isDark ? 'dark' : 'light'}
                    style={{ padding: 32, borderRadius: 48, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>Growth Analytics</Text>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Cycle: 30D Analysis</Text>
                        </View>
                        <BarChart3 size={24} color="#a855f7" strokeWidth={2.5} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{ color: '#94a3b8', fontWeight: '900', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Clicks</Text>
                            <Text style={{ color: isDark ? 'white' : '#0f172a', fontWeight: '900', fontSize: 20 }}>1.2k</Text>
                            <View style={{ height: 3, width: 24, backgroundColor: '#3b82f6', borderRadius: 4, marginTop: 8 }} />
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{ color: '#94a3b8', fontWeight: '900', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Conv.</Text>
                            <Text style={{ color: isDark ? 'white' : '#0f172a', fontWeight: '900', fontSize: 20 }}>4.2%</Text>
                            <View style={{ height: 3, width: 24, backgroundColor: '#10b981', borderRadius: 4, marginTop: 8 }} />
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Text style={{ color: '#94a3b8', fontWeight: '900', fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Earned</Text>
                            <Text style={{ color: isDark ? 'white' : '#0f172a', fontWeight: '900', fontSize: 20 }}>KSh 500</Text>
                            <View style={{ height: 3, width: 24, backgroundColor: '#a855f7', borderRadius: 4, marginTop: 8 }} />
                        </View>
                    </View>

                    {/* Elite Tier Progress */}
                    <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ padding: 20, borderRadius: 24, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ color: isDark ? 'white' : '#475569', fontWeight: '900', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Tier: Elite Partner</Text>
                            <Text style={{ color: '#a855f7', fontWeight: '900', fontSize: 10 }}>65%</Text>
                        </View>
                        <View style={{ height: 8, backgroundColor: isDark ? '#1e293b' : '#e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                            <MotiView
                                from={{ width: '0%' }}
                                animate={{ width: '65%' }}
                                transition={{ type: 'spring', damping: 15, delay: 500 }}
                                style={{ height: '100%', backgroundColor: '#a855f7' }}
                            />
                        </View>
                    </GlassView>
                </GlassView>
            </PerspectiveView>

            {/* Referral Protocol Hub */}
            <View style={{ marginBottom: 32 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>Marketing Protocol</Text>
                    <Sparkles size={18} color="#a855f7" strokeWidth={2.5} />
                </View>

                <PerspectiveView>
                    <GlassView
                        intensity={40}
                        tint="dark"
                        style={{ padding: 32, borderRadius: 48, backgroundColor: '#3b0764' }}
                    >
                        <View style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1, transform: [{ rotate: '15deg' }] }}>
                            <Target size={140} color="white" />
                        </View>

                        <Text style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '900', fontSize: 10, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 16 }}>Master Access Key</Text>
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 24, paddingVertical: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                            <Text numberOfLines={1} style={{ flex: 1, color: 'white', fontWeight: '800', fontSize: 13 }}>leli.shop/join?ref={user?.id?.substring(0, 8)}</Text>
                            <TouchableOpacity style={{ marginLeft: 16 }}>
                                <Copy size={20} color="#c084fc" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={{ height: 68, borderRadius: 24, backgroundColor: '#7e22ce', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Share2 size={22} color="white" strokeWidth={2.5} />
                            <Text style={{ color: 'white', fontWeight: '900', fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, marginLeft: 12 }}>Distribute Kit</Text>
                        </TouchableOpacity>
                    </GlassView>
                </PerspectiveView>
            </View>

            {/* System Actions */}
            <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ borderRadius: 40, overflow: 'hidden' }}>
                <TouchableOpacity onPress={() => { }} style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 48, width: 48, borderRadius: 16, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                        <MousePointerClick size={22} color="#3b82f6" strokeWidth={2.5} />
                    </View>
                    <Text style={{ flex: 1, fontSize: 16, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>Campaign Log</Text>
                    <ChevronRight size={20} color="#3b82f6" strokeWidth={3} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/settings/payout')} style={{ padding: 24, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 48, width: 48, borderRadius: 16, backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                        <Wallet size={22} color="#10b981" strokeWidth={2.5} />
                    </View>
                    <Text style={{ flex: 1, fontSize: 16, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>Ledger Config</Text>
                    <ChevronRight size={20} color="#10b981" strokeWidth={3} />
                </TouchableOpacity>
            </GlassView>
        </ScrollView>
    );
};
