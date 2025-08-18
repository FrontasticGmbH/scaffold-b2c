import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getLocalizationInfo } from 'project.config';

type Place = {
  'place name': string;
  state: string;
  'state abbreviation': string;
  longitude: string;
  latitude: string;
};

type GeoInfo = {
  'country abbreviation'?: string;
  country?: string;
  'post code'?: string;
  places?: Array<Place>;
};

const useGeo = () => {
  const { locale } = useParams();

  const isValidZipcode = useCallback((zipcode: string) => {
    return zipcode && zipcode.length >= 3 && zipcode.length <= 9;
  }, []);

  const getInfoByZipcode = useCallback(
    async (zipcode: string) => {
      if (!isValidZipcode(zipcode)) return {};

      const { countryCode } = getLocalizationInfo(locale);

      const response = await fetch(`https://api.zippopotam.us/${countryCode.toLowerCase()}/${zipcode}`);

      const data: GeoInfo = await response.json();

      return data;
    },
    [locale, isValidZipcode],
  );

  return { getInfoByZipcode };
};

export default useGeo;
