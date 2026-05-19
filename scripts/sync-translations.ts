import fs from 'fs';
import path from 'path';

const STRAPI_URL =
  process.env.STRAPI_URL || process.env.STRAPI_URL;

const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

const DEFAULT_LOCALE = 'en';
const SECONDARY_LOCALE = 'vi';

type Locale = typeof DEFAULT_LOCALE | typeof SECONDARY_LOCALE;

type StrapiTranslationItem = {
  id: number;
  documentId: string;
  key: string;
  value: string;
  locale?: string;
};

type StrapiListResponse<T> = {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

type StrapiSingleResponse<T> = {
  data: T;
};

function flattenObject(
  obj: Record<string, any>,
  prefix = '',
  result: Record<string, string> = {}
) {
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
      return;
    }

    result[newKey] = String(value ?? '');
  });

  return result;
}

function readLocaleFile(locale: Locale) {
  const filePath = path.join(
    process.cwd(),
    'src',
    'config',
    'locale',
    `${locale}.json`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Locale file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  return flattenObject(JSON.parse(raw));
}

function getHeaders() {
  if (!STRAPI_TOKEN) {
    throw new Error('Missing STRAPI_TOKEN');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  };
}

async function strapiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!STRAPI_URL) {
    throw new Error('Missing STRAPI_URL');
  }

  const res = await fetch(`${STRAPI_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();

    throw new Error(
      `Strapi request failed: ${res.status} ${res.statusText}\n${errorText}`
    );
  }

  return res.json() as Promise<T>;
}

async function loadExistingKeys(locale: Locale) {
  const existingKeys = new Set<string>();
  const pageSize = 100;

  let page = 1;
  let pageCount = 1;

  do {
    const endpoint =
      `/api/translations?locale=${locale}` +
      `&fields[0]=key` +
      `&pagination[page]=${page}` +
      `&pagination[pageSize]=${pageSize}`;

    const json = await strapiRequest<
      StrapiListResponse<StrapiTranslationItem>
    >(endpoint);

    json.data.forEach((item) => {
      existingKeys.add(item.key);
    });

    pageCount = json.meta?.pagination?.pageCount || 1;
    page++;
  } while (page <= pageCount);

  console.log(`Loaded [${locale}]: ${existingKeys.size} existing keys`);

  return existingKeys;
}

async function createDefaultTranslation(key: string, value: string) {
  const json = await strapiRequest<
    StrapiSingleResponse<StrapiTranslationItem>
  >(`/api/translations?locale=${DEFAULT_LOCALE}`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        key,
        value,
      },
    }),
  });

  console.log(`Created [${DEFAULT_LOCALE}]: ${key}`);

  return json.data;
}

async function createLocalization(
  documentId: string,
  key: string,
  value: string,
  locale: Locale
) {
  await strapiRequest(`/api/translations/${documentId}?locale=${locale}`, {
    method: 'PUT',
    body: JSON.stringify({
      data: {
        key,
        value,
      },
    }),
  });

  console.log(`Created localization [${locale}]: ${key}`);
}

async function main() {
  if (!STRAPI_URL) {
    throw new Error('Missing STRAPI_URL');
  }

  if (!STRAPI_TOKEN) {
    throw new Error('Missing STRAPI_TOKEN');
  }

  const enMessages = readLocaleFile(DEFAULT_LOCALE);
  const viMessages = readLocaleFile(SECONDARY_LOCALE);

  const existingEnKeys = await loadExistingKeys(DEFAULT_LOCALE);
  const existingViKeys = await loadExistingKeys(SECONDARY_LOCALE);

  const allKeys = Array.from(
    new Set([...Object.keys(enMessages), ...Object.keys(viMessages)])
  );

  const newKeys = allKeys.filter(
    (key) => !existingEnKeys.has(key) && !existingViKeys.has(key)
  );

  console.log(`\nTotal local keys: ${allKeys.length}`);
  console.log(`New keys to create: ${newKeys.length}`);

  for (const key of newKeys) {
    const enValue = enMessages[key] ?? '';
    const viValue = viMessages[key] ?? enValue;

    const enRecord = await createDefaultTranslation(key, enValue);

    await createLocalization(
      enRecord.documentId,
      key,
      viValue,
      SECONDARY_LOCALE
    );

    existingEnKeys.add(key);
    existingViKeys.add(key);
  }

  console.log('\nSync translations completed.');
}

main().catch((error) => {
  console.error('\nSync translations failed:');
  console.error(error);
  process.exit(1);
});