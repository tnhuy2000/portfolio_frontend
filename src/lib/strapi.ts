// lib/strapi.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchStrapi<T>(endpoint: string, options: RequestInit = {}) {
  try {
    const url = `${STRAPI_URL}/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (typeof window === 'undefined') {
      fetchOptions.next = { ...fetchOptions.next, revalidate: 3600 }; // Cache lâu hơn, chỉ chạy trên server
    }

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      if (res.status === 403) {
        console.warn(`🚫 403 Forbidden: ${endpoint} - Kiểm tra Permissions trong Strapi`);
        throw new Error('403_FORBIDDEN');
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    return data as T;
  } catch (error: any) {
    console.error(`Fetch error ${endpoint}:`, error.message);
    throw error;
  }
}