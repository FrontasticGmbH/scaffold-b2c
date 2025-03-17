import React, { createContext, useContext, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProjectSettings } from 'shared/types/ProjectSettings';
import { useRouter } from 'i18n/routing';
import { Category } from 'types/entity/category';
import { ContextShape, Option, Location } from './types';
import usePath from '../../helpers/hooks/usePath';
import { mapCountry } from '../../helpers/utils/mapCountry';
import { Country } from '../../types/entity/country';

const initialMarketState = {
  selectedLanguage: {} as Option,
  selectedLocation: {} as Location,
  locations: [] as Location[],
} as ContextShape;

export const ShipAndLanguageContext = createContext(initialMarketState);

const ShipAndLanguageProvider = ({
  children,
  projectSettings,
  categories = [],
}: React.PropsWithChildren<{ projectSettings?: ProjectSettings; categories?: Category[] }>) => {
  const router = useRouter();
  const { path } = usePath();

  const countries = (projectSettings?.countries ?? []).map(mapCountry).filter((value): value is Country => {
    return value !== null && value !== undefined;
  });

  const locations = countries.map(
    ({ name, code, currencies, locales }) =>
      ({
        name,
        label: `${name} (${currencies[0]})`,
        value: code.toLowerCase(),
        flagName: code.toLowerCase(),
        defaultLanguage: locales[0].locale,
        languages: locales.map(({ name, locale }) => ({ name, value: locale })),
      }) as Location,
  );

  const { locale } = useParams();

  const [selectedLocationValue, setSelectedLocationValue] = useState(
    countries.find((country) => country.locales.find((l) => l.locale === locale))?.code.toLowerCase(),
  );

  const selectedLocation = locations.find((location) => location.value === selectedLocationValue);
  const selectedLanguage =
    selectedLocation?.languages.find((language) => language.value === locale) ?? selectedLocation?.languages[0];

  const onLanguageSelect = (language: string) => {
    let pathToGo = path;

    // Check whether the localized url for this plp is correct (Only for PLP pages)
    const correctPath = categories.find((c) => Object.values(c._urls ?? {}).includes(path.slice(0, -1)))?._urls?.[
      language
    ];

    if (correctPath && path !== correctPath) pathToGo = correctPath;

    router.push(pathToGo, { locale: language });
  };

  const onLocationSelect = (location: string) => {
    const locationObject = locations.find((l) => l.value === location);

    setSelectedLocationValue(location);

    if (!locationObject?.languages.find((language) => language.value === locale)) {
      onLanguageSelect(locationObject?.defaultLanguage ?? '');
    }
  };

  return (
    <ShipAndLanguageContext.Provider
      value={{
        selectedLanguage,
        selectedLocation,
        locations,
        onLanguageSelect,
        onLocationSelect,
      }}
    >
      {children}
    </ShipAndLanguageContext.Provider>
  );
};
export default ShipAndLanguageProvider;
export const useShipAndLanguage = () => useContext(ShipAndLanguageContext);
