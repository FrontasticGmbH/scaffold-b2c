import { FC, useCallback, useContext, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Button from 'components/commercetools-ui/atoms/button';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Typography from 'components/commercetools-ui/atoms/typography';
import FlagIcons from 'components/icons/flags';
import { MarketContext } from 'context/market';
import useClassNames from 'helpers/hooks/useClassNames';
import { Market } from '../header/types';

export interface Props {
  menuTop?: boolean;
}

const MarketButtonMobile: FC<Props> = ({ menuTop }) => {
  const { market: selectedMarket, markets, handleMarket } = useContext(MarketContext);

  const marketButtonClassNames = useCallback(
    (open?: boolean) => {
      return `flex h-40 w-full items-center justify-between border ${
        open
          ? `rounded-t-sm border-x-neutral-500 ${
              menuTop ? 'border-b-neutral-500 border-t-neutral-400' : 'border-t-neutral-500 border-b-neutral-400'
            }`
          : 'rounded-sm border-neutral-500'
      } bg-white px-16 py-12 active:border-gray-500 focus:border-gray-500 focus:shadow-md`;
    },
    [menuTop],
  );

  const marketMenuWrapperClassNames = useClassNames([menuTop ? 'bottom-39' : 'top-40', 'absolute left-0 w-full']);

  const marketMenuClassNames = useCallback(
    (open?: boolean) => {
      return `max-h-300 overflow-scroll rounded-b-sm border ${
        open
          ? `border-x-neutral-500 ${menuTop ? 'border-t-neutral-500' : 'border-b-neutral-500'}`
          : 'border-neutral-400'
      } bg-white`;
    },
    [menuTop],
  );

  const handleMarketClick = (market: Market) => {
    handleMarket(market);
  };

  const marketButtonElement = useMemo(() => {
    return (
      <div className="flex w-full cursor-pointer justify-between">
        <div className="flex w-fit items-center justify-start">
          <FlagIcons flagName={selectedMarket?.flag} className="my-auto mr-8" />
          <Typography className="text-14 text-secondary-black">{selectedMarket?.region}</Typography>
        </div>
        <div className="flex justify-end">
          <ChevronDownIcon strokeWidth={2} className="w-16 text-secondary-black" />
        </div>
      </div>
    );
  }, [selectedMarket]);

  return (
    <>
      {markets && markets.length !== 0 && (
        <Dropdown
          customButtonElement={marketButtonElement}
          customMenuWrapperClassNames={marketMenuWrapperClassNames}
          customButtonClassNames={marketButtonClassNames}
          customMenuClassNames={marketMenuClassNames}
        >
          {markets.map((market) => (
            <Menu.Item key={market.locale}>
              <div className="overflow-y-scroll hover:bg-neutral-200 active:bg-neutral-200">
                <Button
                  variant="ghost"
                  size="full"
                  onClick={() => handleMarketClick(market)}
                  className="flex w-full items-center justify-start px-16 py-12"
                >
                  <div className="flex w-fit items-center justify-start">
                    <FlagIcons flagName={market.flag} className="mr-8" />
                    <Typography as="span" className="text-14 font-normal text-secondary-black">
                      {market?.region}
                    </Typography>
                  </div>
                </Button>
              </div>
            </Menu.Item>
          ))}
        </Dropdown>
      )}
    </>
  );
};

export default MarketButtonMobile;
