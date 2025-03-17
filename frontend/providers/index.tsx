'use client';

import { useParams } from 'next/navigation';
import { SDKResponse } from '@commercetools/frontend-sdk';
import { PageResponse } from '@commercetools/frontend-sdk/lib/types/api/page';
import { Category } from 'shared/types/product';
import { ProjectSettings } from 'shared/types/ProjectSettings';
import Toaster from 'components/commercetools-ui/atoms/toaster';
import { AccountProvider } from 'context/account';
import AddToCartOverlayProvider from 'context/add-to-cart-overlay';
import { mapCategotry } from 'helpers/entity-mappers/map-category';
import { sdk } from 'sdk';
import ShipAndLanguageProvider from './ship-and-language';
import { SWRProvider } from './swr';
import TracingProvider from './tracing';
import { GetAccountActionReturn } from '../sdk/composable-commerce/types/actions/AccountActions';

interface ProvidersProps {
  accountResult?: SDKResponse<GetAccountActionReturn>;
  flattenedCategories?: Category[];
  page: SDKResponse<PageResponse>;
  projectSettings?: SDKResponse<ProjectSettings>;
}

export const Providers = ({
  accountResult,
  projectSettings,
  flattenedCategories = [],
  page,
  children,
}: React.PropsWithChildren<ProvidersProps>) => {
  const { locale } = useParams();

  sdk.defaultConfigure(locale);

  return (
    <TracingProvider page={page}>
      <SWRProvider
        value={{
          fallback: {
            '/action/account/getAccount': accountResult,
            '/action/project/getProjectSettings': projectSettings,
          },
        }}
      >
        <ShipAndLanguageProvider
          projectSettings={projectSettings?.isError ? undefined : projectSettings?.data}
          categories={flattenedCategories.map((c) => mapCategotry(c, { locale }))}
        >
          <AddToCartOverlayProvider>
            <AccountProvider>{children}</AccountProvider>
          </AddToCartOverlayProvider>
        </ShipAndLanguageProvider>
        <Toaster />
      </SWRProvider>
    </TracingProvider>
  );
};
