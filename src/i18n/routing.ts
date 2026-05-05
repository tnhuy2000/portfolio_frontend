import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  localePrefix: 'never' // Don't add locale prefix to URLs
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
