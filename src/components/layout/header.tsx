"use client";

import { useState, useEffect } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { navItems as navigationItems }  from '../../config/navigation'
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { usePublicSettings } from '@/contexts/PublicSettingsContext';
import { StrapiImage } from '../ui';
import Link from 'next/link';

export function Header() {
  const t = useTranslations();
  const { settings } = usePublicSettings();
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use API data if available, otherwise fallback to static data
  const apiNavItems = navigationItems

  const navItems = apiNavItems && apiNavItems.length > 0
    ? apiNavItems
      .toSorted((a, b) => a.order - b.order)
      .map((nav) => ({ label: nav.label, href: nav.href, translationKey: nav.translationKey }))
    : navigationItems;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link  href='/' className="flex items-center gap-2 cursor-pointer">
          <StrapiImage image={settings?.logo} className='w-10 dark:invert'/>
        </Link >

        <div className="hidden md:flex items-center gap-8">
          {navItems?.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {t(`${link?.translationKey}`)}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </Link>
          ))}
          <LanguageSwitcher/>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-accent hover:bg-accent/80 transition-all"
          >
            {mounted ? (
              isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />

            )}
          </motion.button>
        </div>

        <button
          aria-label="button-menu"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-3 rounded-2xl bg-accent"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg"
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {navItems.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-2 text-muted-foreground hover:text-foreground"
              >
                {t(`${link?.translationKey}`)}
              </Link>
            ))}
             <LanguageSwitcher setIsOpen={setIsOpen}/>
            <button
              aria-label="button-mode"
              onClick={() => { toggleTheme(); setIsOpen(false); }}
              className="flex items-center gap-3 py-3 text-muted-foreground hover:text-foreground"
            >
              {mounted ? (
                <> {
                  isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />

                }
                  {isDark ? t('textLightMode') : t('textDarkMode')}

                </>

              ) : (<>
                <Moon className="w-5 h-5" />
                {t('textLightMode')}
              </>

              )}
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
