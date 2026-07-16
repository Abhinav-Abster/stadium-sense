import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Proxy for locale detection and URL-based routing.
 * Automatically redirects to locale-prefixed paths (e.g., /en, /es).
 */
export default createMiddleware(routing);

export const config = {
  // Match all paths except API routes, Next.js internals, and static files
  matcher: ['/((?!api|_next|_vercel|.*..*).*)'],
};
