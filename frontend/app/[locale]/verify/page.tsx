import { redirect } from 'next/navigation';
import getServerOptions from 'helpers/server/get-server-options';
import { sdk } from 'sdk';
import { PageProps } from 'types/next';

export const revalidate = 300; // 5 minutes
export const fetchCache = 'force-cache';

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = params;

  const token = searchParams.token as string;

  sdk.defaultConfigure(locale);

  const response = await sdk.composableCommerce.account.confirm({ token }, { ...getServerOptions() });

  if (response.isError) return redirect('/login?verify=0');

  return redirect('/login?verify=1');
}
