import { ProjectSettings } from 'shared/types/ProjectSettings';
import countries from '../../../frontastic/lib/utils/countries.json';
import { getLocalizationInfo, i18nConfig } from '../../../project.config';
import { Country } from '../../../types/entity/country';

export const mapCountry = (country: Required<ProjectSettings>['countries'][0]): Country | undefined => {
  const matchedCountry = countries.find((c) => c.code.toLowerCase() === country.toLowerCase());

  const matchedLocales = i18nConfig.locales.filter((locale) =>
    getLocalizationInfo(locale).countries.find((c) => c.toLowerCase() === country.toLowerCase()),
  );

  if (matchedLocales.length === 0) {
    console.warn(`Cannot find configuration for ${country}`);
    return undefined;
  }

  return {
    name: matchedCountry?.name ?? '',
    code: matchedCountry?.code ?? '',
    states: matchedCountry?.states ?? [],
    locales:
      matchedLocales.map((locale) => ({
        name: getLocalizationInfo(locale).countryName,
        locale,
      })) || [],
    currencies: matchedLocales.map((locale) => getLocalizationInfo(locale).currency),
  };
};
