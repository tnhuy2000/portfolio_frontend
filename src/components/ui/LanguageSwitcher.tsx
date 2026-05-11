"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }
] as const;

interface LanguageSwitcherType {
  setIsOpen?:  React.Dispatch<React.SetStateAction<boolean>>;
};

export const LanguageSwitcher = ({ setIsOpen }: LanguageSwitcherType) => {
  const t = useTranslations();
  const { locale, changeLanguage } = useLanguage(); // ← Sử dụng Context

  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);


  const handleLanguageChange = (newLocale: 'en' | 'vi') => {
    // Cập nhật Context
    changeLanguage(newLocale);
    setShowLangMenu(false);
    if(setIsOpen) {
      setIsOpen(false)
    }

  };

  // Close menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };

    if (showLangMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLangMenu]);
  return (
    <>
      <div className="hidden md:flex flex items-center gap-2">
        {/* Language Switcher */}
        <div className="relative" ref={langMenuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="group p-2 px-3 rounded-lg bg-accent hover:bg-primary hover:cursor-pointer hover:text-primary-foreground transition-all duration-300 flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: showLangMenu ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Languages className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground" />
            </motion.div>
            <span className="font-mono uppercase text-muted-foreground group-hover:text-primary-foreground">{locale.toUpperCase()}</span>
          </motion.button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 right-0 bg-card border border-border rounded-lg shadow-2xl overflow-hidden min-w-[180px]"
              >
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileHover={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-primary-foreground)'
                    }}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="w-full px-4 py-3 text-left transition-all flex items-center gap-3 hover:cursor-pointer">
                    <motion.span
                      className="text-2xl"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {lang.flag}
                    </motion.span>
                    <span>{lang.label}</span>

                    {/* Check mark for selected language */}
                    {locale === lang.code && <span className="ml-auto">✓</span>}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Language Switcher */}
      <div className="space-y-2 md:hidden">
        <p className="text-muted-foreground flex items-center gap-2">
          <Languages className="w-5 h-5" /> {t('textLanguage')}
        </p>
        {languages.map((lang) => (
          <button
            aria-label="button-change-language"
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${locale === lang.code ? 'bg-accent text-primary' : 'hover:bg-accent/50'
              }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};