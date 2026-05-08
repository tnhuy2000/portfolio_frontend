import { getLocale } from "next-intl/server";
import Cookies from 'js-cookie';
// Server-only fetch (dùng trong Server Component)
export async function fetchStrapiServer<T>(
  endpoint: string,
  options: RequestInit = {}
) {
  const locale = await getLocale();
  console.log('locale', locale)
  return fetchStrapiBase<T>(endpoint, locale, options);
}

// Client fetch (dùng trong Client Component)
export async function fetchStrapiClient<T>(
  endpoint: string,
  // locale?: string,
  options: RequestInit = {}
) {
  
  let currentLocale = Cookies.get('NEXT_LOCALE') || 'en';
  console.log('locale', currentLocale)
    console.log(' locale 2',  Cookies.get('NEXT_LOCALE'))
  return fetchStrapiBase<T>(endpoint, currentLocale, options);
}

// Hàm chung
async function fetchStrapiBase<T>(
  endpoint: string,
  locale: string,
  options: RequestInit = {}
) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  
  const url = `${STRAPI_URL}/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}&locale=${locale}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    next: options.next || { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}