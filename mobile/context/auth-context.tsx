import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const updateTracking = async (userId: string) => {
        try {
            const version = Constants.expoConfig?.version || 'unknown';
            const otaId = Updates.updateId || 'none';
            const platform = Platform.OS;

            await supabase
                .from('user_profiles')
                .update({
                    last_active_at: new Date().toISOString(),
                    last_app_version: version,
                    ota_update_id: otaId,
                    device_platform: platform
                })
                .eq('id', userId);
        } catch (err) {
            console.warn('[Tracking] Failed to update heartbeat:', err);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.warn('Auth session initialization error:', error.message);
                    setSession(null);
                    setUser(null);
                } else {
                    setSession(session);
                    setUser(session?.user ?? null);
                    if (session?.user) updateTracking(session.user.id);
                }
            } catch (err) {
                console.error('Unexpected error during auth initialization:', err);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.info('[AuthContext] Supabase Auth Event:', event);

            if (event === 'SIGNED_OUT') {
                setSession(null);
                setUser(null);
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) updateTracking(session.user.id);
            } else if (event === 'INITIAL_SESSION') {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) updateTracking(session.user.id);
            }

            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
