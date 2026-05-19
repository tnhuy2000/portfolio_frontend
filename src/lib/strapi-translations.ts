import deepmerge from 'deepmerge';
import { Locale } from 'next-intl';

type TranslationItem = {
  key: string;
  value: string;
};

function setNestedValue(obj: Record<string, any>, path: string, value: string) {
  const keys = path.split('.');
  let current = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = current[key] || {};
      current = current[key];
    }
  });
}

async function getStrapiMessages(locale: string) {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_STRAPI_URL');
  }

  const res = await fetch(
    `${apiUrl}/api/translations?locale=${locale}&pagination[pageSize]=300`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch translations from Strapi');
  }

  const json = await res.json();
  const messages: Record<string, any> = {};

  json.data.forEach((item: TranslationItem) => {
    setNestedValue(messages, item.key, item.value);
  });
  return messages;
}

async function getLocalMessages(locale: string) {
  return (await import(`@/config/locale/${locale}.json`)).default;
}

export async function getMessagesWithFallback(locale: string) {
   const localMessages = await getLocalMessages(locale);

  try {
    const strapiMessages = await getStrapiMessages(locale);

    return deepmerge(localMessages, strapiMessages);
  } catch (error) {
    console.error('Load Strapi messages failed, using local JSON:', error);
    return localMessages;
  }
}
