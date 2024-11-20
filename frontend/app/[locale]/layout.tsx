import type { Metadata, Viewport } from 'next';
import { inter, libre } from 'fonts';
import { classnames } from 'helpers/utils/classnames';
import { LayoutProps } from 'types/next';
import 'tailwindcss/tailwind.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'styles/app.css';

export const metadata: Metadata = {
  manifest: '/manifest.json',
  icons: {
    apple: '/favicon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFF',
};

export default function RootLayout({ children, params }: LayoutProps) {
  const { locale } = params;

  return (
    <html lang={locale} className={classnames(inter.variable, libre.variable)}>
      <body>{children}</body>
    </html>
  );
}
