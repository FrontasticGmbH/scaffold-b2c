export interface Params {
  locale: string;
  slug: string[];
  [key: string]: string | string[] | undefined;
}

export type SearchParams = Record<string, string>;

export interface PageProps {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export type LayoutProps = React.PropsWithChildren<PageProps>;
