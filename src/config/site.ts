import { Setting } from "@/types";
import { getImageStrapiUrl } from "@/utils/image";
import { Metadata } from "next";

export function generateSeoMetadata(
  seo: Setting
): Metadata  {
  const imageUrl = getImageStrapiUrl(seo?.SEO_metaImage?.url);

  return {
    title: seo?.SEO_metaTitle,
    
    description:
      seo?.SEO_metaDescription,

    keywords: seo?.SEO_keywords,

    openGraph: {
      title: seo?.SEO_metaTitle,

      description:
        seo?.SEO_metaDescription,
      siteName: "Portfolio",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],

      locale: "en_US",

      type: "website",
    },
    icons: {
      icon: seo?.favicon?.url
        ? getImageStrapiUrl(
            seo.favicon.url
          )
        : "/favicon.ico",
    },
  }
}