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

export interface LayoutProps {
  params: Promise<Params>;
  children: React.ReactNode;
}
