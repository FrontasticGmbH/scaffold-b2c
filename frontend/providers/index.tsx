'use client';

import { useParams } from 'next/navigation';
import { SDKResponse } from '@commercetools/frontend-sdk';
import { PageResponse } from '@commercetools/frontend-sdk/lib/types/api/page';
import { Category } from 'shared/types/product';
import Toaster from 'components/commercetools-ui/atoms/toaster';
import { AccountProvider } from 'context/account';
import AddToCartOverlayProvider from 'context/add-to-cart-overlay';
import { mapCategotry } from 'helpers/entity-mappers/map-category';
import { sdk } from 'sdk';
import { Translations } from 'types/i18n';
import I18nProvider from './i18n';
import ShipAndLanguageProvider from './ship-and-language';
import { SWRProvider } from './swr';
import TracingProvider from './tracing';
import { useProjectSettings } from '../frontastic';
import { GetAccountActionReturn } from '../sdk/composable-commerce/types/actions/AccountActions';

interface ProvidersProps {
  translations: Translations;
  accountResult?: SDKResponse<GetAccountActionReturn>;
  flattenedCategories?: Category[];
  page: SDKResponse<PageResponse>;
}

export const Providers = ({
  translations,
  accountResult,
  flattenedCategories = [],
  page,
  children,
}: React.PropsWithChildren<ProvidersProps>) => {
  const { locale } = useParams();

  sdk.defaultConfigure(locale);

  const { projectSettings } = useProjectSettings();

  return (
    <TracingProvider page={page}>
      <I18nProvider translations={translations}>
        <SWRProvider value={{ fallback: { '/action/account/getAccount': accountResult } }}>
          <ShipAndLanguageProvider
            projectSettings={projectSettings}
            categories={flattenedCategories.map((c) => mapCategotry(c, { locale }))}
          >
            <AddToCartOverlayProvider>
              <AccountProvider>{children}</AccountProvider>
            </AddToCartOverlayProvider>
          </ShipAndLanguageProvider>
          <Toaster />
        </SWRProvider>
      </I18nProvider>
    </TracingProvider>
  );
};
