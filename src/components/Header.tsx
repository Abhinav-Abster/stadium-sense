import { useTranslations } from 'next-intl';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

/**
 * Header — app header with logo/title, language selector, and theme toggle.
 * Uses semantic HTML with proper heading hierarchy.
 */
export default function Header() {
  const t = useTranslations('header');

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-b border-gray-700/50 bg-gray-950/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label="Stadium">
            🏟️
          </span>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:inline">
              {t('highContrast')}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
