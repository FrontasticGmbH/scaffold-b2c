import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Market } from 'components/commercetools-ui/organisms/header/types';
import { getLocalizationInfo, i18nConfig } from 'project.config';
import usePath from './usePath';

const useMarket = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [market, setMarket] = useState<Market>();
  const router = useRouter();

  const { path } = usePath();

  const { locale } = useParams();

  const handleMarket = (market: Market) => {
    setMarket(market);

    router.push(`/${market.locale.substring(0, 2)}${path}`);
  };

  useEffect(() => {
    const initialMarkets = i18nConfig.locales.map((nextLocale) => {
      const { locale, currency, currencyCode, countryCode, countryName } = getLocalizationInfo(nextLocale);

      return {
        locale,
        currencyCode,
        region: countryName,
        flag: countryCode,
        currency: currency,
      };
    });

    if (!initialMarkets) return;

    setMarkets(initialMarkets);

    let initialMarket = initialMarkets.find((market) => market.locale.substring(0, 2) === locale);
    if (!initialMarket) {
      initialMarket = initialMarkets.find((market) => market.locale.substring(0, 2) === i18nConfig.defaultLocale);
    }

    setMarket(initialMarket);
  }, [locale]);

  return { market, markets, handleMarket };
};

export default useMarket;
