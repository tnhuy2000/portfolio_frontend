import { getLocale } from "next-intl/server";
import Cookies from 'js-cookie';

const clientResponseCache = new Map<string, unknown>();
const clientRequestCache = new Map<string, Promise<unknown>>();
const clientActivityListeners = new Set<(activeRequests: number) => void>();
let activeClientRequests = 0;

function notifyClientActivity() {
  clientActivityListeners.forEach((listener) => listener(activeClientRequests));
}

function trackClientRequest<T>(request: Promise<T>) {
  activeClientRequests += 1;
  notifyClientActivity();

  return request.finally(() => {
    activeClientRequests = Math.max(0, activeClientRequests - 1);
    notifyClientActivity();
  });
}

export function subscribeClientApiActivity(listener: (activeRequests: number) => void) {
  clientActivityListeners.add(listener);
  listener(activeClientRequests);

  return () => {
    clientActivityListeners.delete(listener);
  };
}
// Server-only fetch (dùng trong Server Component)
export async function fetchStrapiServer<T>(
  endpoint: string,
  options: RequestInit = {}
) {
  const locale = await getLocale();
  return fetchStrapiBase<T>(endpoint, locale, options);
}

// Client fetch (dùng trong Client Component)
export async function fetchStrapiClient<T>(
  endpoint: string,
  options: RequestInit = {}
) {
  const currentLocale = Cookies.get('NEXT_LOCALE') || 'en';
  const cacheKey = `${currentLocale}:${endpoint}`;
  const shouldBypassClientCache = options.cache === 'no-store';

  if (!shouldBypassClientCache && clientResponseCache.has(cacheKey)) {
    return clientResponseCache.get(cacheKey) as T;
  }

  const existingRequest = clientRequestCache.get(cacheKey);
  if (!shouldBypassClientCache && existingRequest) {
    return existingRequest as Promise<T>;
  }

  const request = trackClientRequest(
    fetchStrapiBase<T>(endpoint, currentLocale, options)
      .then((response) => {
        if (!shouldBypassClientCache) {
          clientResponseCache.set(cacheKey, response);
        }
        return response;
      })
      .finally(() => {
        clientRequestCache.delete(cacheKey);
      })
  );

  clientRequestCache.set(cacheKey, request);
  return request;
}

// Hàm chung
async function fetchStrapiBase<T>(
  endpoint: string,
  locale: string,
  options: RequestInit = {}
) {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  
  const url = `${STRAPI_URL}/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}&locale=${locale}`;
  const shouldUseDefaultRevalidate = options.cache !== 'no-store' && !options.next;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...(shouldUseDefaultRevalidate ? { next: { revalidate: 3600 } } : {}),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}
