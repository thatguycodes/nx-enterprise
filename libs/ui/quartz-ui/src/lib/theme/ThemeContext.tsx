import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type BrandMode = 'quartz' | 'ruby';

interface ThemeContextType {
  mode: ThemeMode;
  brand: BrandMode;
  setMode: (mode: ThemeMode) => void;
  setBrand: (brand: BrandMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialBrand?: BrandMode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialBrand = 'quartz', 
  initialMode = 'light' 
}) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [brand, setBrand] = useState<BrandMode>(initialBrand);

  useEffect(() => {
    const themeKey = `${brand}-${mode}`;
    document.documentElement.setAttribute('data-theme', themeKey);
  }, [mode, brand]);

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, brand, setMode, setBrand, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
