'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { stadiums } from '@/lib/stadium-data';

/** Transport tip response from the API. */
interface TransportTip {
  suggestion: string;
  estimatedCO2Saving: string;
  stadiumName: string;
}

/**
 * TransportTipPanel — Sustainability transport tip component.
 * Lets fans enter their starting location and get eco-friendly transit suggestions
 * with estimated CO2 savings compared to driving.
 */
export default function TransportTipPanel() {
  const t = useTranslations('transport');
  const [origin, setOrigin] = useState('');
  const [stadiumId, setStadiumId] = useState(stadiums[0]?.id ?? '');
  const [tip, setTip] = useState<TransportTip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !stadiumId) return;

    setLoading(true);
    setError(null);
    setTip(null);

    try {
      const response = await fetch('/api/transport-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: origin.trim(), stadiumId }),
      });

      if (response.status === 429) {
        setError(t('errorGeneric'));
        return;
      }

      if (!response.ok) {
        setError(t('errorGeneric'));
        return;
      }

      const data = await response.json();
      setTip(data);
    } catch {
      setError(t('errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="transport-title"
      className="rounded-2xl bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 p-6"
    >
      <h2
        id="transport-title"
        className="text-xl font-bold text-emerald-400 mb-2"
      >
        🌱 {t('title')}
      </h2>
      <p className="text-gray-400 text-sm mb-4">{t('description')}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Stadium Selector */}
        <div>
          <label
            htmlFor="transport-stadium-select"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {t('selectStadium')}
          </label>
          <select
            id="transport-stadium-select"
            aria-label={t('selectStadium')}
            value={stadiumId}
            onChange={(e) => setStadiumId(e.target.value)}
            className="w-full rounded-lg bg-gray-800 border border-gray-600 text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {stadiums.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.city}
              </option>
            ))}
          </select>
        </div>

        {/* Origin Input */}
        <div>
          <label
            htmlFor="transport-origin-input"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            {t('originLabel')}
          </label>
          <input
            id="transport-origin-input"
            type="text"
            aria-label={t('originLabel')}
            placeholder={t('originPlaceholder')}
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            maxLength={200}
            className="w-full rounded-lg bg-gray-800 border border-gray-600 text-gray-200 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          id="transport-submit-btn"
          type="submit"
          disabled={loading || !origin.trim()}
          aria-label={loading ? t('loading') : t('getTip')}
          className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-2.5 px-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {loading ? t('loading') : t('getTip')}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div
          role="alert"
          className="mt-4 p-3 rounded-lg bg-red-900/50 border border-red-700/50 text-red-300 text-sm"
        >
          {error}
        </div>
      )}

      {/* Result Display */}
      {tip && (
        <div className="mt-4 space-y-3 animate-in fade-in duration-300">
          {/* Suggestion Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-700/30">
            <p className="text-gray-200 leading-relaxed">{tip.suggestion}</p>
          </div>

          {/* CO2 Saving Badge */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/60 border border-gray-700/50">
            <span className="text-2xl" role="img" aria-label="Leaf">
              🍃
            </span>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">
                {t('co2Saved')}
              </p>
              <p className="text-lg font-bold text-emerald-400">
                {tip.estimatedCO2Saving}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
