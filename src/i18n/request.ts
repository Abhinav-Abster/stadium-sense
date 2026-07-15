import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/**
 * Load translation messages for the current locale.
 * Used by next-intl to provide server-side translations.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate the locale — fall back to default if invalid
  if (!locale || !routing.locales.includes(locale as 'en' | 'es' | 'fr' | 'pt')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
