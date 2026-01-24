import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: 'light' | 'dark';
    mode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'leli-theme-preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const deviceColorScheme = useDeviceColorScheme();
    const [mode, setMode] = useState<ThemeMode>('light'); // Default to light

    useEffect(() => {
        // Load persisted preference
        AsyncStorage.getItem(THEME_STORAGE_KEY).then((savedMode) => {
            if (savedMode) {
                setMode(savedMode as ThemeMode);
            }
        });
    }, []);

    const setThemeMode = async (newMode: ThemeMode) => {
        setMode(newMode);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    };

    // Logical theme applied to UI - FORCED TO LIGHT ONLY
    const theme = 'light'; // Always use light theme, dark mode disabled

    return (
        <ThemeContext.Provider value={{ theme, mode, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

/**
 * Helper hook that returns the resolved theme ('light' | 'dark')
 * Drop-in replacement for useColorScheme() to ensure consistency
 */
export function useAppColorScheme() {
    const { theme } = useTheme();
    return theme;
}
