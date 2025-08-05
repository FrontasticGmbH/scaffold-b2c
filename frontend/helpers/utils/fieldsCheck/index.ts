import { Address } from 'components/commercetools-ui/organisms/checkout/components/steps/sections/addresses/types';

export const isOnlyCountryFilled = (address: Address) => {
  const countryIsFilled = Object.entries(address).every(([key, value]) => {
    if (key === 'country') {
      return !!value;
    }
    return !value;
  });

  return countryIsFilled;
};
