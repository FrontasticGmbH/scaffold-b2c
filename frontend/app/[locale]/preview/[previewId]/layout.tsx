import fetchPageData from 'helpers/server/fetch-page-data';

export default async function PreviewLayout({ children, params, searchParams }: any) {
  const page = await fetchPageData(params, searchParams);

  return (
    <div data-theme={(!page.isError && page.data.pageFolder.configuration.displayTheme) ?? 'default'}>{children}</div>
  );
}
