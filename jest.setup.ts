/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream } from 'stream/web';
import { MessageChannel } from 'worker_threads';

// Extend expect matcher with axe-core matchers
expect.extend(toHaveNoViolations);

// Mock window.scrollTo since JSDOM doesn't support it
window.scrollTo = jest.fn();

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// 1. Polyfill TextEncoder and TextDecoder immediately before importing undici
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// 2. Polyfill ReadableStream
global.ReadableStream = ReadableStream as any;

// 3. Polyfill MessagePort
global.MessagePort = new MessageChannel().port1.constructor as any;

// 4. Require undici synchronously after globals are defined to avoid hoisting issues
const { Request, Response, Headers } = require('undici');
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Create stable translation functions to prevent infinite loop state updates in tests
const stableTranslation = (namespace?: string) => {
  const t = (key: string): string => {
    return namespace ? `${namespace}.${key}` : key;
  };
  return t;
};

const translationCache = new Map<string, (key: string) => string>();

// Mock next-intl with stable translation function references
jest.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => {
    const key = namespace || 'default';
    if (!translationCache.has(key)) {
      translationCache.set(key, stableTranslation(namespace));
    }
    return translationCache.get(key) as (key: string) => string;
  },
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/en',
}));
