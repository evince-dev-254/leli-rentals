import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#F97316', // Orange-500 to match website
    secondary: '#8B5CF6', // Purple for secondary
    tertiary: '#10B981', // Green for success
    surface: '#FFFFFF',
    surfaceVariant: '#F9FAFB',
    background: '#F8FAFC',
    error: '#EF4444',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#1F2937',
    onBackground: '#1F2937',
    outline: '#E5E7EB',
    outlineVariant: '#F3F4F6',
    // Additional colors to match website
    blue: '#3B82F6',
    purple: '#8B5CF6',
    green: '#10B981',
    yellow: '#FBBF24',
    red: '#EF4444',
    orange: '#F97316',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FB923C', // Orange-400 for dark mode
    secondary: '#A78BFA', // Purple-400
    tertiary: '#34D399', // Green-400
    surface: '#1F2937',
    surfaceVariant: '#374151',
    background: '#111827',
    error: '#F87171',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onSurface: '#F9FAFB',
    onBackground: '#F9FAFB',
    outline: '#4B5563',
    outlineVariant: '#374151',
    // Additional colors to match website
    blue: '#60A5FA',
    purple: '#A78BFA',
    green: '#34D399',
    yellow: '#FDE047',
    red: '#F87171',
    orange: '#FB923C',
  },
};

export const theme = lightTheme;

export const colors = {
  primary: '#F97316', // Orange to match website
  secondary: '#8B5CF6',
  tertiary: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // Category colors matching website
  categoryColors: {
    vehicles: '#3B82F6', // Blue
    homes: '#10B981', // Green
    equipment: '#F97316', // Orange
    events: '#8B5CF6', // Purple
    fashion: '#EC4899', // Pink
    tech: '#8B5CF6', // Purple
    sports: '#EF4444', // Red
    photography: '#06B6D4', // Cyan
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    lineHeight: 22,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    lineHeight: 24,
  },
};
