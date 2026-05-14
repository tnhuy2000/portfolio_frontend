"use client"
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
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
  initialSettings?: Setting;
}

export const PublicSettingsProvider = ({ children, initialSettings }: PublicSettingsProviderProps) => {
  const { locale } = useLanguage();
  const [settings, setSettings] = useState<Setting | undefined>(initialSettings);
  const [isLoading, setIsLoading] = useState(!initialSettings);
  const skippedInitialFetchRef = useRef(Boolean(initialSettings));

  const fetchSettings = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (!initialSettings) return;

    setSettings(initialSettings);
    setIsLoading(false);
  }, [initialSettings]);

  useEffect(() => {
    if (skippedInitialFetchRef.current) {
      skippedInitialFetchRef.current = false;
      return;
    }

    fetchSettings();
  }, [fetchSettings, locale]);

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
