"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

type Locale = 'en' | 'vi';

interface LanguageContextType {
  locale: Locale;
  changeLanguage: (newLocale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export const LanguageProvider = ({ children, initialLocale = 'en' }: LanguageProviderProps) => {
  const [locale, setLocale] = useState<Locale>(initialLocale); // Khởi tạo mặc định trước
  const router = useRouter();

  // Load từ localStorage sau khi component mount (Client-side)
  useEffect(() => {
    const savedLocale2 = Cookies.get('NEXT_LOCALE') as Locale | undefined;
    if (savedLocale2 && savedLocale2 !== locale) {
      setLocale(savedLocale2);
    }
  }, [locale]);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
      // Xử lý next-intl
    Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 });
    // Refresh để next-intl áp dụng ngôn ngữ mới
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
