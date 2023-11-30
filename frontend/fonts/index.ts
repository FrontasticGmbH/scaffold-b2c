import { Inter, Libre_Baskerville } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const libre = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-libre',
  display: 'swap',
  weight: '400',
});
