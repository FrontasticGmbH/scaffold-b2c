import React, { useMemo, useState } from 'react';
import { MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Market } from 'components/commercetools-ui/organisms/header/types';
import FlagIcons from 'components/icons/flags';
import { dropDownMarket, dropDownMarkets } from 'helpers/mocks/mockAtomsData';
import Dropdown from '..';
import Button from '../../button';
import Typography from '../../typography';

const CustomDropdownMarket = () => {
  const [selectedMarket, setSelectedMarket] = useState(dropDownMarket);

  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market);
  };

  const marketButtonElement = useMemo(() => {
    return (
      <div className="flex w-full cursor-pointer items-center justify-between">
        <div className="flex w-fit cursor-pointer items-center justify-start">
          <FlagIcons flagName={selectedMarket.flag} className="my-auto mr-8" />
          <Typography className="text-14 text-gray-600">
            {`${selectedMarket.region} | ${selectedMarket.currency} ${selectedMarket.currencyCode}`}
          </Typography>
        </div>
        <ChevronDownIcon strokeWidth={2} className="w-16 text-gray-600" />
      </div>
    );
  }, [selectedMarket]);

  return (
    <div className="mt-24 w-2/5">
      <Dropdown customButtonElement={marketButtonElement}>
        {dropDownMarkets.map((market) => (
          <MenuItem key={market.locale}>
            <div className="overflow-y-scroll hover:bg-neutral-200 active:bg-neutral-200">
              <Button
                variant="ghost"
                size="full"
                onClick={() => handleMarketClick(market)}
                className="flex w-full items-center justify-start px-16 py-12"
              >
                <div className="flex w-fit items-center justify-start">
                  <FlagIcons flagName={market.flag} className="mr-8" />
                  <Typography as="span" className="text-14 font-normal text-gray-600">
                    {market?.region}
                  </Typography>
                </div>
              </Button>
            </div>
          </MenuItem>
        ))}
      </Dropdown>
    </div>
  );
};

export default CustomDropdownMarket;
