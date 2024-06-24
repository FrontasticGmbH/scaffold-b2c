import { Metadata } from 'next';
import { inter, libre } from 'fonts';
import fetchPageData from 'helpers/server/fetch-page-data';
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

export default async function RootLayout({ children, params, searchParams }: LayoutProps) {
  const { locale } = params;

  const page = await fetchPageData(params, searchParams);

  return (
    <html
      lang={locale}
      className={classnames(inter.variable, libre.variable)}
      data-theme={(!page.isError && page.data.pageFolder.configuration.displayTheme) ?? 'default'}
    >
      <body className="pt-[148px] md:pt-[180px] lg:pt-[183px] xl:pt-[173px]">{children}</body>
    </html>
  );
}
