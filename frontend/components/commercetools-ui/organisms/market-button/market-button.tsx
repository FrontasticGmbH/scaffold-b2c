import { useState } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Drawer from 'components/commercetools-ui/atoms/drawer';
import FlagIcons from 'components/icons/flags';
import { useShipAndLanguage } from '../../../../providers/ship-and-language';

const MarketButton = () => {
  const [showMarket, setShowMarket] = useState(false);
  const { locations, selectedLocation, selectedLanguage, onLocationSelect, onLanguageSelect } = useShipAndLanguage();

  const translate = useTranslations();

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
          <p className="ml-5 text-14 font-normal text-white hover:underline">{selectedLocation.name}</p>
        </Button>
      )}

      <Drawer
        isOpen={showMarket}
        direction="right"
        className="w-[90%] max-w-380 bg-neutral-200"
        onClose={hideMarketMenu}
      >
        <div className="flex w-full items-center justify-between border-b border-neutral-400 px-16 py-20">
          <h5 className="text-22 text-primary">{translate('common.select-country')}</h5>
          <Button variant="ghost" onClick={hideMarketMenu} title={translate('common.close')} className="p-0">
            <XMarkIcon className="w-28 text-gray-600" />
          </Button>
        </div>

        <div className="pt-20">
          <p className="ml-5 px-12 text-14 font-semibold text-gray-700">{translate('common.shop-ship-title')}</p>
          {locations.map((location) => (
            <Button
              key={location.flagName}
              variant="ghost"
              onClick={() => onLocationSelect(location.value)}
              className="ml-5 flex w-full items-center justify-start py-14"
            >
              {selectedLocation?.value === location.value && <CheckIcon className="ml-5 mr-11 w-20" />}
              <FlagIcons flagName={location.flagName} className="mr-8 h-20 w-32" />
              <span className="font-normal text-primary">{location.label}</span>
            </Button>
          ))}
          {selectedLocation?.languages && selectedLocation.languages.length > 0 && (
            <div className="pt-5">
              <p className="ml-5 px-12 text-14 font-semibold text-gray-700">{translate('common.language')}</p>
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
                  <span className="font-normal text-primary">{language.name}</span>
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
