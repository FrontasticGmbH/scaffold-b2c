'use client';

import { useParams } from 'next/navigation';
import { GetAccountActionReturn } from '../sdk/composable-commerce/types/actions/AccountActions';
import { SDKResponse } from '@commercetools/frontend-sdk';
import Toaster from 'components/commercetools-ui/atoms/toaster';
import AddToCartOverlayProvider from 'context/add-to-cart-overlay';
import { sdk } from 'sdk';
import { Translations } from 'types/i18n';
import I18nProvider from './i18n';
import { SWRProvider } from './swr';

interface ProvidersProps {
  translations: Translations;
  accountResult?: SDKResponse<GetAccountActionReturn>;
}

export const Providers = ({ translations, accountResult, children }: React.PropsWithChildren<ProvidersProps>) => {
  const { locale } = useParams();

  sdk.configureForNext(locale);

  return (
    <I18nProvider translations={translations}>
      <SWRProvider value={{ fallback: { '/action/account/getAccount': accountResult } }}>
        <AddToCartOverlayProvider>{children}</AddToCartOverlayProvider>
        <Toaster />
      </SWRProvider>
    </I18nProvider>
  );
};
