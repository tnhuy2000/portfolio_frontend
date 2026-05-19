import { getMessagesWithFallback } from "@/lib/strapi-translations";
import { Locale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'en';

  return {
    locale,
    messages: await getMessagesWithFallback(locale),
    timeZone: 'Asia/Ho_Chi_Minh',
  };
});