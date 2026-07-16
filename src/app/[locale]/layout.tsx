import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import '@/app/[locale]/globals.css';

export const metadata: Metadata = {
  title: 'StadiumSense — FIFA World Cup 2026 Assistant',
  description: 'AI-enabled stadium operations and fan experience assistant for FIFA World Cup 2026',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as 'en' | 'es' | 'fr' | 'pt')) {
    notFound();
  }

  // Get messages for the provider
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main className="flex-1 bg-radial from-gray-900 to-gray-950">{children}</main>
          <footer
            role="contentinfo"
            className="border-t border-gray-900 py-6 bg-gray-950 text-center text-xs text-gray-500"
          >
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>
                StadiumSense uses simulated data for demonstration purposes. Not affiliated with
                FIFA.
              </p>
              <p>Built with WCAG 2.1 AA compliance in mind.</p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
