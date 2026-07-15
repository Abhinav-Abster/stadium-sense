'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

/** Supported locales with their display labels. */
const LOCALES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
] as const;

/**
 * LanguageSelector — dropdown for switching between supported languages.
 * Uses next-intl locale routing to change the URL prefix.
 */
export default function LanguageSelector() {
  const t = useTranslations('header');
  const router = useRouter();
  const pathname = usePathname();

  /** Extract the current locale from the pathname. */
  const currentLocale = LOCALES.find((l) =>
    pathname.startsWith(`/${l.code}`)
  )?.code ?? 'en';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    // Replace the locale prefix in the current path
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="language-selector"
        className="text-sm text-gray-400 hidden sm:inline"
      >
        {t('language')}:
      </label>
      <select
        id="language-selector"
        aria-label={t('language')}
        value={currentLocale}
        onChange={handleChange}
        className="rounded-lg bg-gray-800 border border-gray-600 text-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        {LOCALES.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.flag} {locale.label}
          </option>
        ))}
      </select>
    </div>
  );
}
