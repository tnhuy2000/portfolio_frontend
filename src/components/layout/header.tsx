"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Code2, Menu, Moon, Sun, X } from 'lucide-react';
import { usePublicSettings } from '@/contexts/PublicSettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
// Fallback navigation items (used when API is loading or fails)
const fallbackNavItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contacts', href: '#contact' },
];

const languages = [
  { code: 'En', label: 'English' },
  { code: 'Vi', label: 'Vietnamese' },
];

export function Header() {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeLanguage, setActiveLanguage] = useState('En');

  // Use API data if available, otherwise fallback to static data
  const apiNavItems = fallbackNavItems as Array<{
    label: string;
    href: string;
    order: number;
  }> | undefined;

  const navItems = apiNavItems && apiNavItems.length > 0
    ? apiNavItems
      .toSorted((a, b) => a.order - b.order)
      .map((nav) => ({ label: nav.label, href: nav.href }))
    : fallbackNavItems;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href='/' className="flex items-center gap-2 cursor-pointer">
          <span className="font-mono text-xl font-semibold">&lt;/&gt;</span>dev
          <span className="font-mono text-xl font-semibold">&lt;/&gt;</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </a>
          ))}

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
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-2 text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { toggleTheme(); setIsOpen(false); }}
              className="flex items-center gap-3 py-3 text-muted-foreground hover:text-foreground"
            >
              {mounted ? (
                <> {
                  isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />

                }
                  {isDark ? 'Light Mode' : 'Dark Mode'}

                </>

              ) : (<>
                <Moon className="w-5 h-5" />
                Light Mode
              </>

              )}
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
