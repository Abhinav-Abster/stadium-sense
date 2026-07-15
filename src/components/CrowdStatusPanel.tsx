'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { stadiums } from '@/lib/stadium-data';

interface ZoneDisplay {
  zoneId: string;
  zoneName: string;
  currentOccupancy: number;
  capacity: number;
  percentFull: number;
}

interface CrowdData {
  summary: string;
  recommendation: string;
  alertLevel: 'low' | 'medium' | 'high';
  zones: ZoneDisplay[];
  scenario: string;
  timestamp: string;
}

export default function CrowdStatusPanel() {
  const t = useTranslations('crowd');
  const [stadiumId, setStadiumId] = useState('metlife-stadium'); // Default to MetLife (fully detailed)
  const [data, setData] = useState<CrowdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async (targetId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/crowd-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stadiumId: targetId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const resData = await response.json();
      setData(resData);
    } catch {
      setError(t('loading') + ' error. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Initial fetch and auto-refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStatus(stadiumId);
    }, 0);

    const interval = setInterval(() => {
      fetchStatus(stadiumId);
    }, 30000); // 30s auto-refresh

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [stadiumId, fetchStatus]);

  // Color mapping helper for alert level
  const getAlertConfig = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-red-950/40 border-red-800/60',
          text: 'text-red-400',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
          label: t('alertHigh'),
          icon: '🚨',
        };
      case 'medium':
        return {
          bg: 'bg-amber-950/40 border-amber-800/60',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          label: t('alertMedium'),
          icon: '⚠️',
        };
      case 'low':
      default:
        return {
          bg: 'bg-green-950/40 border-green-800/60',
          text: 'text-green-400',
          badgeBg: 'bg-green-500/20 text-green-300 border-green-500/30',
          label: t('alertLow'),
          icon: '✅',
        };
    }
  };

  // Color mapping helper for zones
  const getZoneColorClass = (percent: number) => {
    if (percent > 85) return { text: 'text-red-400', bar: 'bg-red-500' };
    if (percent > 70) return { text: 'text-amber-400', bar: 'bg-amber-500' };
    return { text: 'text-green-400', bar: 'bg-green-500' };
  };

  const alertConfig = data ? getAlertConfig(data.alertLevel) : null;

  return (
    <section
      aria-labelledby="crowd-title"
      className="rounded-2xl bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 p-6 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 id="crowd-title" className="text-xl font-bold text-amber-400">
            📊 {t('title')}
          </h2>
          <p className="text-sm text-gray-400">{t('description')}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stadium Selector */}
          <select
            aria-label={t('selectStadium')}
            value={stadiumId}
            onChange={(e) => setStadiumId(e.target.value)}
            className="rounded-lg bg-gray-800 border border-gray-700 text-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            {/* Filter to detailed stadiums that generate simulated data */}
            {stadiums
              .filter((s) => ['metlife-stadium', 'sofi-stadium', 'estadio-azteca', 'hard-rock-stadium', 'bc-place'].includes(s.id))
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchStatus(stadiumId)}
            disabled={loading}
            aria-label={t('refresh')}
            className="rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 p-2 text-sm transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            🔄
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-4 rounded-lg bg-red-900/50 border border-red-700/50 text-red-300 mb-4 text-sm">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <div className="text-gray-400 text-sm flex flex-col items-center gap-3">
            <span className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
            <span>{t('loading')}</span>
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-6 flex-1 flex flex-col">
          {/* AI Insights Block */}
          <div
            role="status"
            aria-live="polite"
            className={`p-5 rounded-xl border ${alertConfig?.bg} flex flex-col sm:flex-row items-start gap-4 transition-all duration-300`}
          >
            <span className="text-3xl" role="img" aria-label="Status icon">
              {alertConfig?.icon}
            </span>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-bold text-gray-150">{t('summary')}</h3>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${alertConfig?.badgeBg}`}>
                  {alertConfig?.label}
                </span>
                <span className="text-xs text-gray-500">
                  Scenario: {data.scenario} | {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{data.summary}</p>
              <div className="border-t border-gray-850 pt-2 mt-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  {t('recommendation')}
                </h4>
                <p className="text-amber-350 text-sm font-medium">{data.recommendation}</p>
              </div>
            </div>
          </div>

          {/* Zones Grid */}
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
              {t('occupancy')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.zones.map((zone) => {
                const colors = getZoneColorClass(zone.percentFull);
                return (
                  <div
                    key={zone.zoneId}
                    className="p-4 rounded-xl bg-gray-850 border border-gray-800/80 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-semibold text-gray-200">{zone.zoneName}</span>
                      <span className={`text-sm font-bold ${colors.text}`}>
                        {zone.percentFull}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      {/* Custom Progress Bar */}
                      <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full ${colors.bar} transition-all duration-500`}
                          style={{ width: `${Math.min(zone.percentFull, 100)}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>{zone.currentOccupancy.toLocaleString()} in</span>
                        <span>Cap: {zone.capacity.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
