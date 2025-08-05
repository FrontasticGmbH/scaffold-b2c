import { useMemo } from 'react';
import * as yup from 'yup';
import { useTranslations } from 'use-intl';

const useAddressValidationSchema = () => {
  const translate = useTranslations();

  const addressValidationSchema = useMemo(
    () =>
      yup
        .object()
        .shape({
          firstName: yup.string().required(translate('common.fieldIsRequired')),
          lastName: yup.string().required(translate('common.fieldIsRequired')),
          email: yup.string().when('$loggedIn', {
            is: false,
            then: yup.string().email().required(translate('common.fieldIsRequired')),
            otherwise: yup.string().optional(),
          }),
          phone: yup.string().optional(),
          country: yup.string().required(translate('common.fieldIsRequired')),
          streetName: yup.string().required(translate('common.fieldIsRequired')),
          streetNumber: yup.string().required(translate('common.fieldIsRequired')),
          postalCode: yup.string().required(translate('common.fieldIsRequired')),
          state: yup.string().when('country', (country, schema) => {
            return ['US', 'CA'].includes(country)
              ? schema.required(translate('common.fieldIsRequired'))
              : schema.optional();
          }),
          city: yup.string().required(translate('common.fieldIsRequired')),
        })
        .required(),
    [],
  );

  return addressValidationSchema;
};

export default useAddressValidationSchema;
