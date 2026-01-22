import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Sun, Moon, Laptop } from 'lucide-react-native';
import { useTheme } from '../theme-provider';
import { MotiView } from 'moti';

export function ThemeSwitcher() {
    const { theme, mode, setThemeMode } = useTheme();

    const toggleTheme = () => {
        if (mode === 'light') setThemeMode('dark');
        else if (mode === 'dark') setThemeMode('system');
        else setThemeMode('light');
    };

    const getIcon = () => {
        if (mode === 'system') return <Laptop size={20} color={theme === 'dark' ? '#fb923c' : '#ed8936'} />;
        if (mode === 'dark') return <Moon size={20} color="#fb923c" />;
        return <Sun size={20} color="#ed8936" />;
    };

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center mr-2"
        >
            <MotiView
                from={{ scale: 0.5, rotate: '45deg' }}
                animate={{ scale: 1, rotate: '0deg' }}
                transition={{ type: 'spring', damping: 15 }}
                key={mode}
            >
                {getIcon()}
            </MotiView>
        </TouchableOpacity>
    );
}
