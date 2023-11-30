import React, { createContext } from 'react';
import { Market } from 'components/commercetools-ui/organisms/header/types';
import useMarket from 'helpers/hooks/useMarket';

const initialMarketState = {
  market: {} as Market,
  markets: [] as Market[],
  handleMarket: {} as (market: Market) => void,
};

const MarketContext = createContext(initialMarketState);

const MarketProvider = ({ children }: React.PropsWithChildren) => {
  const { market, markets, handleMarket } = useMarket();

  return (
    <MarketContext.Provider value={{ market: market as Market, markets, handleMarket }}>
      {children}
    </MarketContext.Provider>
  );
};

export { MarketContext, MarketProvider };
