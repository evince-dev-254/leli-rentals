import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Key, TrendingUp, ClipboardList, Plus, ChevronRight, Zap, ShieldCheck, Clock } from 'lucide-react-native';
import { MotiView } from 'moti';
import { PerspectiveView } from '@/components/ui/perspective-view';
import { GlassView } from '@/components/ui/glass-view';
import { useTheme } from '@/components/theme-provider';

const StatCard = ({ label, value, icon: Icon, isDark }: any) => (
    <GlassView intensity={15} tint={isDark ? 'dark' : 'light'} style={{ flex: 1, padding: 24, borderRadius: 32, alignItems: 'center' }}>
        <PerspectiveView floatEnabled={true} style={{ marginBottom: 16 }}>
            <View style={{ height: 56, width: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)' }}>
                <Icon size={28} color="#10b981" strokeWidth={2.5} />
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
                style={{ padding: 32, borderRadius: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(16, 185, 129, 0.1)' }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 28, fontWeight: '900', color: isDark ? 'white' : '#0f172a', marginBottom: 4 }}>Hello, {name || 'Host'}!</Text>
                    <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>Scaling Your Fleet Today</Text>
                </View>
                <View style={{ height: 60, width: 60, borderRadius: 24, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center', shadowColor: '#10b981', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 12 }}>
                    <Key size={28} color="white" strokeWidth={2.5} />
                </View>
            </GlassView>
        </PerspectiveView>
    );
};

export const OwnerDashboardView = ({ router, user, stats }: any) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const isVerified = stats?.profile?.id_verified || false;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            <WelcomeBanner name={user?.user_metadata?.full_name?.split(' ')[0]} isDark={isDark} />

            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
                <StatCard label="Active Ads" value={stats?.listingCount || 0} icon={ClipboardList} isDark={isDark} />
                <StatCard label="Total Vol" value={`KSh ${stats?.totalEarnings || 0}`} icon={TrendingUp} isDark={isDark} />
            </View>

            {/* Verification Priority Hub */}
            <TouchableOpacity onPress={() => router.push('/dashboard/verification')}>
                <PerspectiveView style={{ marginBottom: 32 }}>
                    <GlassView
                        intensity={isVerified ? 10 : 30}
                        tint={isDark ? 'dark' : 'light'}
                        style={{ padding: 24, borderRadius: 40, flexDirection: 'row', alignItems: 'center', backgroundColor: isVerified ? 'transparent' : (isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)'), borderWidth: 1, borderColor: isVerified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.3)' }}
                    >
                        <View style={{ height: 56, width: 56, borderRadius: 20, backgroundColor: isVerified ? '#10b981' : '#f59e0b', alignItems: 'center', justifyContent: 'center', marginRight: 20, shadowColor: isVerified ? '#10b981' : '#f59e0b', shadowOpacity: 0.3, shadowRadius: 10 }}>
                            {isVerified ? <ShieldCheck size={28} color="white" strokeWidth={2.5} /> : <Clock size={28} color="white" strokeWidth={2.5} />}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>
                                {isVerified ? "Secure Host Protocol" : "Verify Ecosystem ID"}
                            </Text>
                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
                                {isVerified ? "Verified Asset Provider" : "Action Required for Full Access"}
                            </Text>
                        </View>
                        {!isVerified && <ChevronRight size={20} color="#f59e0b" strokeWidth={3} />}
                    </GlassView>
                </PerspectiveView>
            </TouchableOpacity>

            {/* Revenue Analytics - Immersive Card */}
            <TouchableOpacity onPress={() => router.push('/settings/payout')}>
                <PerspectiveView style={{ marginBottom: 32 }}>
                    <GlassView
                        intensity={40}
                        tint="dark"
                        style={{ padding: 32, borderRadius: 48, backgroundColor: '#064e3b' }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                            <View>
                                <Text style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '900', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2 }}>Gross Yield</Text>
                                <Text style={{ color: 'white', fontWeight: '900', fontSize: 32, marginTop: 4 }}>KSh {stats?.totalEarnings || '0.00'}</Text>
                            </View>
                            <GlassView intensity={10} tint="dark" style={{ height: 60, width: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <TrendingUp size={32} color="#10b981" strokeWidth={2.5} />
                            </GlassView>
                        </View>

                        <View style={{ height: 100, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6 }}>
                            {[30, 50, 45, 80, 55, 100, 75, 60, 90, 110, 85, 120].map((h, i) => (
                                <MotiView
                                    key={i}
                                    from={{ height: 0, opacity: 0 }}
                                    animate={{ height: (h / 120) * 80, opacity: 1 }}
                                    transition={{ delay: 300 + i * 50, type: 'spring' }}
                                    style={{ flex: 1, backgroundColor: '#10b981', borderRadius: 4 }}
                                />
                            ))}
                        </View>

                        <GlassView intensity={10} tint="dark" style={{ marginTop: 32, padding: 16, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                            <Text style={{ color: 'white', fontWeight: '900', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 }}>Access Ledger</Text>
                        </GlassView>
                    </GlassView>
                </PerspectiveView>
            </TouchableOpacity>

            {/* Fleet Management Area */}
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>Asset Management</Text>
                    <TouchableOpacity onPress={() => router.push('/listings/manage')}>
                        <Text style={{ color: '#10b981', fontWeight: '900', fontSize: 12 }}>SYSTEM LOG</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/listings/create')}
                    style={{ marginBottom: 24 }}
                >
                    <GlassView intensity={15} tint={isDark ? 'dark' : 'light'} style={{ padding: 40, borderRadius: 48, borderStyle: 'dashed', borderWidth: 2, borderColor: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.4)', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={40} color="#10b981" strokeWidth={3} style={{ marginBottom: 16 }} />
                        <Text style={{ color: '#10b981', fontWeight: '900', fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 }}>Initialize Asset</Text>
                    </GlassView>
                </TouchableOpacity>

                <GlassView intensity={10} tint={isDark ? 'dark' : 'light'} style={{ borderRadius: 40, overflow: 'hidden' }}>
                    <TouchableOpacity onPress={() => { }} style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ height: 48, width: 48, borderRadius: 16, backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                            <ClipboardList size={22} color="#3b82f6" strokeWidth={2.5} />
                        </View>
                        <Text style={{ flex: 1, fontSize: 16, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>Active Protocol</Text>
                        <View style={{ backgroundColor: isDark ? '#1e293b' : '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                            <Text style={{ color: '#3b82f6', fontWeight: '900', fontSize: 12 }}>{stats?.listingCount || 0}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { }} style={{ padding: 24, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ height: 48, width: 48, borderRadius: 16, backgroundColor: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                            <Zap size={22} color="#a855f7" strokeWidth={2.5} />
                        </View>
                        <Text style={{ flex: 1, fontSize: 16, fontWeight: '900', color: isDark ? 'white' : '#0f172a' }}>Boost Reach</Text>
                        <ChevronRight size={20} color="#a855f7" strokeWidth={3} />
                    </TouchableOpacity>
                </GlassView>
            </View>
        </ScrollView>
    );
};
