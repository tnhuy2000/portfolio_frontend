"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPublicSettings } from '@/lib/api';
import { Setting } from '@/types';
import { useLanguage } from './LanguageContext';


interface PublicSettingsContextType {
  settings?: Setting;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const PublicSettingsContext = createContext<PublicSettingsContextType | undefined>(undefined);

export const usePublicSettings = () => {
  const context = useContext(PublicSettingsContext);
  if (!context) {
    throw new Error('usePublicSettings must be used within a PublicSettingsProvider');
  }
  return context; 
};

interface PublicSettingsProviderProps {
  children: ReactNode;
}

export const PublicSettingsProvider = ({ children }: PublicSettingsProviderProps) => {
  const { locale } = useLanguage();
  const [settings, setSettings] = useState<Setting>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await getPublicSettings()
      if (settings) {
        setSettings(settings);
      }
    } catch (error) {
      console.error('Error fetching public settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, [locale]);

  const value = {
    settings,
    isLoading,
    refetch: fetchSettings,
  };

  return (
    <PublicSettingsContext.Provider value={value}>
      {children}
    </PublicSettingsContext.Provider>
  );
};
