import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeName = 'light' | 'dark';

const LIGHT = {
  primary: '#0B3B5A',
  accent: '#D4AF37',
  background: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  card: '#F3F4F6', // 👈 cor do fundo dos cards no tema claro

};

const DARK = {
  primary: '#9DD3FF',
  accent: '#FFD36E',
  background: '#0B1220',
  text: '#E6EEF6',
  card: '#1E2633', // 👈 cor do fundo dos cards no tema escuro
  muted: '#9AA6B2',
};

type Theme = typeof LIGHT;

type ThemeContextValue = {
  themeName: ThemeName;
  colors: Theme;
  toggleTheme: () => Promise<void>;
  setThemeName: (t: ThemeName) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeNameState] = useState<ThemeName>('light');

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw === 'dark' || raw === 'light') setThemeNameState(raw);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const setThemeName = async (t: ThemeName) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, t);
    } catch (e) {
      // ignore
    }
    setThemeNameState(t);
  };

  const toggleTheme = async () => {
    const next = themeName === 'light' ? 'dark' : 'light';
    await setThemeName(next);
  };

  const colors = themeName === 'light' ? LIGHT : DARK;

  return (
    <ThemeContext.Provider value={{ themeName, colors, toggleTheme, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeContext;
