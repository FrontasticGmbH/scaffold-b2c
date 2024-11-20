import { ReadonlyURLSearchParams } from 'next/navigation';
import { PageViewData } from '@commercetools/frontend-sdk/lib/types/api/page';
import { Page as BasePage, PageFolder, Section } from '@frontastic/extension-types';
import { Params } from './next';

export {};

declare global {
  declare const gtag: (type: string, label: string, payload: unknown) => void;

  interface Window {
    gtag: (type: string, label: string, payload: unknown) => void;
  }
}

declare module 'next/navigation' {
  export function useSearchParams(): ReadonlyURLSearchParams;
  export function useParams(): Params;
  export function usePathname(): string;
}
