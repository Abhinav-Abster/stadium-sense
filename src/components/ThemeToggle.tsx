'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

/**
 * ThemeToggle — toggles high-contrast mode for accessibility.
 * Persists preference in localStorage and applies a CSS class to the document root.
 */
export default function ThemeToggle() {
  const t = useTranslations('header');
  const [highContrast, setHighContrast] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('stadiumsense-high-contrast');
    if (saved === 'true') {
      const timer = setTimeout(() => {
        setHighContrast(true);
      }, 0);
      document.documentElement.classList.add('high-contrast');
      return () => clearTimeout(timer);
    }
  }, []);

  const toggle = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem('stadiumsense-high-contrast', String(next));

    if (next) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggle}
      aria-label={t('highContrast')}
      aria-pressed={highContrast}
      className={`
        relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900
        ${highContrast ? 'bg-yellow-500' : 'bg-gray-600'}
      `}
    >
      <span className="sr-only">{t('highContrast')}</span>
      <span
        className={`
          inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200
          ${highContrast ? 'translate-x-7' : 'translate-x-1'}
        `}
      >
        <span className="flex h-full w-full items-center justify-center text-xs">
          {highContrast ? '☀️' : '🌙'}
        </span>
      </span>
    </button>
  );
}
