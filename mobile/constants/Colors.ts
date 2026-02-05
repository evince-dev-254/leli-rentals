const tintColorLight = '#f97316'; // Leli Orange
const tintColorDark = '#fff';

export const KejapinColors = {
  primary: '#0f172a',      // Slate 900 (Structural)
  secondary: '#f97316',    // Leli Orange (Highlight)
  background: '#fffdf0',   // Leli Cream
  surface: '#FFFFFF',      // Pure White
  text: '#1e293b',         // Slate 800
  accent: '#10b981',       // Emerald 500
  error: '#ef4444',        // Red 500
  glass: 'rgba(255, 255, 255, 0.15)',
};

export default {
  light: {
    text: '#1e293b',
    background: '#fffdf0',
    tint: tintColorLight,
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
    surface: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.7)',
  },
  dark: {
    text: '#f8fafc',
    background: '#0f172a',
    tint: tintColorDark,
    tabIconDefault: '#475569',
    tabIconSelected: tintColorDark,
    surface: '#1e293b',
    glass: 'rgba(15, 23, 42, 0.7)',
  },
};
