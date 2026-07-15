import { defineRouting } from 'next-intl/routing';

/**
 * Internationalization routing configuration.
 * Supports English, Spanish, French, and Portuguese.
 */
export const routing = defineRouting({
  locales: ['en', 'es', 'fr', 'pt'],
  defaultLocale: 'en',
});
