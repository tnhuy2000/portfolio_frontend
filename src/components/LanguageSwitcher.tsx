"use client";

import { useLocale } from 'next-intl';
import { Switch } from 'antd';
import { useTransition } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  vi: { name: 'Tiếng Việt', flag: '🇻🇳' },
} as const;

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isVietnamese = locale === 'vi';

  const handleLanguageChange = (checked: boolean) => {
    const newLocale = checked ? 'vi' : 'en';

    startTransition(() => {
      // Save to cookie
      Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 });

      // Refresh to apply new locale
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isVietnamese}
        onChange={handleLanguageChange}
        loading={isPending}
        checkedChildren={SUPPORTED_LANGUAGES['vi'].flag}
        unCheckedChildren={SUPPORTED_LANGUAGES['en'].flag}
      />
    </div>
  );
};
