const PLACEHOLDER_IMAGE = '/placeholder.jpg';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';


// Type for any object with url property (flexible for Apollo cache types)
type UrlLike = { url?: string | null } | null | undefined;

/**
 * Get image URL from LinkDocument or any object with url property
 * @param linkDoc - Object with url property or null
 * @param fallback - Fallback image URL (default: placeholder)
 * @returns Image URL string
 */
export const getImageUrl = (
  linkDoc: UrlLike,
  fallback: string = PLACEHOLDER_IMAGE
): string => {
  if (!linkDoc?.url) return fallback;
  return linkDoc.url;
};

export const getImageStrapiUrl = (
  url: string
) => {
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
};

/**
 * Check if object has valid image URL
 */
export const hasImage = (linkDoc: UrlLike): boolean => {
  return Boolean(linkDoc?.url);
};
