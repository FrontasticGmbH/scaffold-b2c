import { useContext, useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from 'components/commercetools-ui/atoms/button';
import Drawer from 'components/commercetools-ui/atoms/drawer';
import Typography from 'components/commercetools-ui/atoms/typography';
import { Market } from 'components/commercetools-ui/organisms/header/types';
import FlagIcons from 'components/icons/flags';
import { MarketContext } from 'context/market';
import { useFormat } from 'helpers/hooks/useFormat';

const MarketButton = () => {
  const [showMarket, setShowMarket] = useState(false);
  const { market: selectedMarket, markets, handleMarket } = useContext(MarketContext);

  const { formatMessage } = useFormat({ name: 'common' });

  const showMarketMenu = () => {
    setShowMarket(true);
  };

  const hideMarketMenu = () => {
    setShowMarket(false);
  };

  const handleMarketClick = (market: Market) => {
    handleMarket(market);
    setShowMarket(false);
  };

  return (
    <div className="hidden w-fit justify-center lg:flex">
      {selectedMarket && (
        <Button variant="ghost" size="fit" onClick={showMarketMenu} className="flex w-fit items-center">
          <FlagIcons flagName={selectedMarket?.flag} className="mr-3 h-16 w-24" />
          <Typography className="ml-5 text-14 font-normal text-neutral-100 hover:underline">
            {selectedMarket?.region}
          </Typography>
        </Button>
      )}

      <Drawer
        isOpen={showMarket}
        direction="right"
        className="w-[90%] max-w-[380px] bg-neutral-200"
        onClose={hideMarketMenu}
      >
        <div className="flex w-full items-center justify-between border-b border-neutral-400 px-16 py-20">
          <Typography as="h5" className="text-22 text-primary-black">
            {formatMessage({ id: 'select.country', defaultMessage: 'Select your country' })}
          </Typography>
          <Button
            variant="ghost"
            onClick={hideMarketMenu}
            title={formatMessage({ id: 'close', defaultMessage: 'Close' })}
            className="p-0"
          >
            <XMarkIcon className="w-28 text-secondary-black" />
          </Button>
        </div>

        <div className="pt-20">
          {markets.map((market) => (
            <Button
              key={market.flag}
              variant="ghost"
              onClick={() => handleMarketClick(market)}
              className="ml-5 flex w-full items-center justify-start py-14"
            >
              {selectedMarket?.region === market?.region && <CheckIcon className="ml-5 mr-11 w-20" />}
              <FlagIcons flagName={market.flag} className="mr-8 h-20 w-32" />
              <Typography className="font-normal text-primary-black">{market.region}</Typography>
            </Button>
          ))}
        </div>
      </Drawer>
    </div>
  );
};
export default MarketButton;
