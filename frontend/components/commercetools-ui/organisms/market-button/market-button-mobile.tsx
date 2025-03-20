import { FC, useCallback, useMemo } from 'react';
import { MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import FlagIcons from 'components/icons/flags';
import useClassNames from 'helpers/hooks/useClassNames';
import { useShipAndLanguage } from '../../../../providers/ship-and-language';

export interface Props {
  menuTop?: boolean;
}

const MarketButtonMobile: FC<Props> = ({ menuTop }) => {
  const translate = useTranslations();
  const { locations, selectedLocation, selectedLanguage, onLocationSelect, onLanguageSelect } = useShipAndLanguage();

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

  const marketButtonElement = useMemo(() => {
    return (
      <div className="flex w-full cursor-pointer justify-between">
        <div className="flex w-fit items-center justify-start">
          {selectedLocation && <FlagIcons flagName={selectedLocation?.flagName} className="my-auto mr-8" />}
          <p className="text-14 text-gray-600">{selectedLocation?.label}</p>
        </div>
        <div className="flex justify-end">
          <ChevronDownIcon strokeWidth={2} className="w-16 text-gray-600" />
        </div>
      </div>
    );
  }, [selectedLocation]);

  const languageButtonElement = useMemo(() => {
    return (
      <div className="flex w-full cursor-pointer justify-between">
        <div className="flex w-fit items-center justify-start">
          <p className="text-14 text-gray-600">{selectedLanguage?.name}</p>
        </div>
        <div className="flex justify-end">
          <ChevronDownIcon strokeWidth={2} className="w-16 text-gray-600" />
        </div>
      </div>
    );
  }, [selectedLanguage]);

  return (
    <>
      {locations && locations.length !== 0 && (
        <>
          <p className="pb-2 text-14 font-semibold text-gray-700">{translate('common.shop-ship-title')}</p>
          <Dropdown
            customButtonElement={marketButtonElement}
            customMenuWrapperClassNames={marketMenuWrapperClassNames}
            customButtonClassNames={marketButtonClassNames}
            customMenuClassNames={marketMenuClassNames}
          >
            {locations.map((location) => (
              <MenuItem key={location.label}>
                <div className="overflow-y-scroll hover:bg-neutral-200 active:bg-neutral-200">
                  <Button
                    variant="ghost"
                    size="full"
                    onClick={() => onLocationSelect(location.value)}
                    className="flex w-full items-center justify-start px-16 py-12"
                  >
                    <div className="flex w-fit items-center justify-start">
                      <FlagIcons flagName={location.flagName} className="mr-8" />
                      <span className="text-14 font-normal text-gray-600">{location.label}</span>
                    </div>
                  </Button>
                </div>
              </MenuItem>
            ))}
          </Dropdown>
        </>
      )}
      {selectedLocation?.languages && selectedLocation.languages.length > 1 && (
        <div className="pt-5">
          <p className="pb-2 text-14 font-semibold text-gray-700">{translate('common.language')}</p>
          <Dropdown
            customButtonElement={languageButtonElement}
            customMenuWrapperClassNames={marketMenuWrapperClassNames}
            customButtonClassNames={marketButtonClassNames}
            customMenuClassNames={marketMenuClassNames}
          >
            {selectedLocation.languages.map((language) => (
              <MenuItem key={language.value}>
                <div className="overflow-y-scroll hover:bg-neutral-200 active:bg-neutral-200">
                  <Button
                    variant="ghost"
                    size="full"
                    onClick={() => onLanguageSelect(language.value)}
                    className="flex w-full items-center justify-start px-16 py-12"
                  >
                    <div className="flex w-fit items-center justify-start">
                      <span className="text-14 font-normal text-gray-600">{language.name}</span>
                    </div>
                  </Button>
                </div>
              </MenuItem>
            ))}
          </Dropdown>
        </div>
      )}
    </>
  );
};

export default MarketButtonMobile;
