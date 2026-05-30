/**
 * AppContext - Global state management
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthService } from '../services/AuthService';

export type Language = 'en' | 'pidgin';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Load user session
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      setLanguage(currentUser.language);
      setIsOnboarded(true);
    } else {
      const onboarded = localStorage.getItem('earsforyou_onboarded');
      setIsOnboarded(onboarded === 'true');
    }

    // Load theme preference (default to dark)
    const savedTheme = localStorage.getItem('earsforyou_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Apply theme to document
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('earsforyou_theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const updateLanguage = (lang: Language) => {
    setLanguage(lang);
    if (user) {
      const updated = AuthService.updateUser({ language: lang });
      if (updated) setUser(updated);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        language,
        setLanguage: updateLanguage,
        isOnboarded,
        setIsOnboarded,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
