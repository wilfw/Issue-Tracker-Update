'use client';

import { Theme } from '@radix-ui/themes';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext<{
  theme: 'dark' | 'light';
  toggle: () => void;
}>({ theme: 'dark', toggle: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <Theme accentColor="violet" appearance={theme}>
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
};
