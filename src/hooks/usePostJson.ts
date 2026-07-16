import { useState, useCallback } from 'react';

/** State managed by the `usePostJson` hook. */
export interface PostJsonState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Return type of the `usePostJson` hook. */
export interface UsePostJsonReturn<T> extends PostJsonState<T> {
  execute: (body: Record<string, unknown>) => Promise<T | null>;
  reset: () => void;
}

/**
 * A lightweight hook for JSON POST requests with built-in loading, error,
 * and rate-limit (429) handling.
 *
 * Eliminates duplicated fetch/loading/error boilerplate across panels.
 *
 * @param url          - The API endpoint to POST to
 * @param errorMessage - A fallback error message shown on non-OK responses
 */
export function usePostJson<T>(url: string, errorMessage: string): UsePostJsonReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (body: Record<string, unknown>): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (response.status === 429) {
          setError(errorMessage);
          return null;
        }

        if (!response.ok) {
          setError(errorMessage);
          return null;
        }

        const result = (await response.json()) as T;
        setData(result);
        return result;
      } catch {
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, errorMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}
