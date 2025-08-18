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
          firstName: yup.string().trim().required(translate('common.fieldIsRequired')),
          lastName: yup.string().trim().required(translate('common.fieldIsRequired')),
          email: yup.string().when('$loggedIn', {
            is: false,
            then: yup.string().email(translate('error.email')).required(translate('common.fieldIsRequired')),
            otherwise: yup.string().optional(),
          }),
          phone: yup.string().optional(),
          country: yup.string().trim().required(translate('common.fieldIsRequired')),
          streetName: yup.string().trim().required(translate('common.fieldIsRequired')),
          streetNumber: yup.string().trim().required(translate('common.fieldIsRequired')),
          postalCode: yup.string().trim().required(translate('common.fieldIsRequired')),
          state: yup.string().when('country', (country, schema) => {
            return ['US', 'CA'].includes(country)
              ? schema.trim().required(translate('common.fieldIsRequired'))
              : schema.optional();
          }),
          city: yup.string().trim().required(translate('common.fieldIsRequired')),
        })
        .required(),
    [],
  );

  return addressValidationSchema;
};

export default useAddressValidationSchema;
