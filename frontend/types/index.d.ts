import { ReadonlyURLSearchParams } from 'next/navigation';
import { PageViewData } from '@commercetools/frontend-sdk/lib/types/api/page';
import { Page as BasePage, PageFolder, Section } from '@frontastic/extension-types';
import { Params } from './next';

export {};

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (command: 'config' | 'event' | 'set', eventName: string, eventParams?: Record<string, any>) => void;
  }
}

declare module 'next/navigation' {
  export function useSearchParams(): ReadonlyURLSearchParams;
  export function useParams(): Params;
  export function usePathname(): string;
}
