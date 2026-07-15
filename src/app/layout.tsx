import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

// Since we have a proxy that redirects to the locale-prefixed path,
// this root layout is only used as a fallback.
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
