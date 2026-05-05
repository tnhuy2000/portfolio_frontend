import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['en', 'vi'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  // Get locale from cookie or default to 'en'
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'en';

  return {
    locale,
    messages: (await import(`@/config/locale/${locale}.json`)).default
  };
});
