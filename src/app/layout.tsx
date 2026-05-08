

import '@/styles/scss/style.scss'

import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import ApolloProvider from "@/lib/apollo-provider";
import { Footer, Header } from "@/components/layout";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { PublicSettingsProvider } from '@/contexts/PublicSettingsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ClientLoadingWrapper from '@/components/shared/ClientLoadingWrapper';
import { LanguageProvider } from '@/contexts/LanguageContext';
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: "--font-be-vietnam-pro",
})

export const metadata: Metadata = {
  title: "Nhu Y Truong | Full-stack Developer",
  description: "Portfolio of Nhu Y Truong, a Full-stack Developer specializing in React.js, Next.js, and Node.js/NestJS. Showcasing projects, experience, and technical skills",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${beVietnamPro.className}`}>
        <NextIntlClientProvider messages={messages}>
          <ApolloProvider>
            <LanguageProvider>
              <PublicSettingsProvider>
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



