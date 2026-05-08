import { Locale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Get locale from cookie or default to 'en'
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'en';

  return {
    locale,
    messages: (await import(`@/config/locale/${locale}.json`)).default,
    timeZone: 'Asia/Ho_Chi_Minh',
  };
});
