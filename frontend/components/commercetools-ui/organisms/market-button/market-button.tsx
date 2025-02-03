import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from 'components/commercetools-ui/atoms/button';
import Drawer from 'components/commercetools-ui/atoms/drawer';
import Typography from 'components/commercetools-ui/atoms/typography';
import FlagIcons from 'components/icons/flags';
import { useFormat } from 'helpers/hooks/useFormat';
import { useShipAndLanguage } from '../../../../providers/ship-and-language';

const MarketButton = () => {
  const [showMarket, setShowMarket] = useState(false);
  const { locations, selectedLocation, selectedLanguage, onLocationSelect, onLanguageSelect } = useShipAndLanguage();

  const { formatMessage } = useFormat({ name: 'common' });

  const showMarketMenu = () => {
    setShowMarket(true);
  };

  const hideMarketMenu = () => {
    setShowMarket(false);
  };

  return (
    <div className="hidden w-fit justify-center lg:flex">
      {selectedLocation && selectedLanguage && (
        <Button variant="ghost" size="fit" onClick={showMarketMenu} className="flex w-fit items-center">
          <FlagIcons flagName={selectedLocation?.flagName} className="mr-3 h-16 w-24" />
          <Typography className="ml-5 text-14 font-normal text-neutral-100 hover:underline">
            {selectedLocation.name}
          </Typography>
        </Button>
      )}

      <Drawer
        isOpen={showMarket}
        direction="right"
        className="w-[90%] max-w-380 bg-neutral-200"
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
          <Typography className="ml-5 px-12 text-14 font-semibold text-gray-800">
            {formatMessage({ id: 'shop.ship.title', defaultMessage: 'Shop and ship to' })}
          </Typography>
          {locations.map((location) => (
            <Button
              key={location.flagName}
              variant="ghost"
              onClick={() => onLocationSelect(location.value)}
              className="ml-5 flex w-full items-center justify-start py-14"
            >
              {selectedLocation?.value === location.value && <CheckIcon className="ml-5 mr-11 w-20" />}
              <FlagIcons flagName={location.flagName} className="mr-8 h-20 w-32" />
              <Typography className="font-normal text-primary-black">{location.label}</Typography>
            </Button>
          ))}
          {selectedLocation?.languages && selectedLocation.languages.length > 0 && (
            <div className="pt-5">
              <Typography className="ml-5 px-12 text-14 font-semibold text-gray-800">
                {formatMessage({ id: 'language', defaultMessage: 'Language' })}
              </Typography>
              {selectedLocation?.languages.map((language) => (
                <Button
                  key={language.value}
                  variant="ghost"
                  onClick={() => onLanguageSelect(language.value)}
                  className="ml-5 flex w-full items-center justify-start py-14"
                >
                  {language.value === (selectedLanguage?.value ?? selectedLocation?.defaultLanguage) && (
                    <CheckIcon className="ml-5 mr-11 w-20" />
                  )}
                  <Typography className="font-normal text-primary-black">{language.name}</Typography>
                </Button>
              ))}
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};
export default MarketButton;
