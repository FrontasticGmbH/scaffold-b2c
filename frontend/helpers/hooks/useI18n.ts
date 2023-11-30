import { useParams } from 'next/navigation';
import { getLocalizationInfo } from 'project.config';

const useI18n = () => {
  const { locale } = useParams();

  const config = getLocalizationInfo(locale);

  const country = config.countryCode;

  const currency = config.currency;

  const currencySymbol = config.currencyCode;

  return { country, currency, currencySymbol };
};

export default useI18n;
