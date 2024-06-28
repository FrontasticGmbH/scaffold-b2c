import { Metadata } from 'next';
import { inter, libre } from 'fonts';
import { classnames } from 'helpers/utils/classnames';
import { LayoutProps } from 'types/next';
import 'tailwindcss/tailwind.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'styles/app.css';

export const metadata = {
  manifest: '/manifest.json',
  icons: {
    apple: '/favicon-192x192.png',
  },
  themeColor: '#FFF',
} as Metadata;

export default function RootLayout({ children, params }: LayoutProps) {
  const { locale } = params;

  return (
    <html lang={locale} className={classnames(inter.variable, libre.variable)}>
      <body>{children}</body>
    </html>
  );
}
