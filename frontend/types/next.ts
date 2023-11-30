export interface Params {
  locale: string;
  slug?: string[] | string;
  [key: string]: string | string[] | undefined;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

export type LayoutProps = React.PropsWithChildren<Pick<PageProps, 'params'>>;
