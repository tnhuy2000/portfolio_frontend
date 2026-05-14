

import '@/styles/scss/style.scss'

import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import ApolloProvider from "@/lib/apollo-provider";
import { Footer, Header } from "@/components/layout";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { PublicSettingsProvider } from '@/contexts/PublicSettingsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ClientLoadingWrapper from '@/components/shared/ClientLoadingWrapper';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { getPublicSettingsServer } from '@/lib/api';
import { generateSeoMetadata } from '@/config/site';
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: "--font-be-vietnam-pro",
})


export async function generateMetadata():Promise<Metadata> {
  try {
    const response = await getPublicSettingsServer();
    return generateSeoMetadata(response);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Portfolio',
      description: 'Portfolio',
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  const initialSettings = await getPublicSettingsServer().catch((error) => {
    console.error('Error fetching initial settings:', error);
    return undefined;
  });

  return (
    <html lang={locale}>
      <body suppressHydrationWarning className={`${beVietnamPro.className}`}>
        <NextIntlClientProvider messages={messages}>
          <ApolloProvider>
            <LanguageProvider initialLocale={locale as 'en' | 'vi'}>
              <PublicSettingsProvider initialSettings={initialSettings}>
                <ThemeProvider>
                  <ClientLoadingWrapper>
                    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
                      <Header />
                      <main>
                        {children}
                      </main>
                      <Footer />
                      <ScrollToTop />
                    </div>
                  </ClientLoadingWrapper>
                </ThemeProvider>

              </PublicSettingsProvider>
            </LanguageProvider>

          </ApolloProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
