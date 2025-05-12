import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import { AccountContext } from 'context/account';
import useGeo from 'helpers/hooks/useGeo';
import useI18n from 'helpers/hooks/useI18n';
import useProcessing from 'helpers/hooks/useProcessing';
import AddressForm from '../steps/sections/addresses/components/address-form';
import { Fields, FieldsOptions } from '../steps/sections/addresses/components/address-form/types';
import useMappers from '../steps/sections/addresses/hooks/useMappers';
import { Address } from '../steps/sections/addresses/types';

interface Props {
  addressType: 'shipping' | 'billing';
  onAfterSubmit: () => void;
}

const CreateAddress = ({ addressType, onAfterSubmit }: Props) => {
  const translate = useTranslations();

  const { processing, startProcessing, stopProcessing } = useProcessing();

  const { getInfoByZipcode } = useGeo();

  const { addressToAccountAddress } = useMappers();

  const { addShippingAddress, addBillingAddress, loggedIn } = useContext(AccountContext);

  const { country } = useI18n();

  const initialData = useMemo(() => ({ addressType, country }) as Address, [addressType]);

  const [data, setData] = useState<Address>(initialData);

  const [saveAsDefault, setSaveAsDefault] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });

      if (e.target.name === 'postalCode') {
        getInfoByZipcode(e.target.value).then((info) => {
          if (info.places?.[0]) setData((data) => ({ ...data, city: info.places[0]['place name'] ?? '' }));
        });
      }
    },
    [data, getInfoByZipcode],
  );

  const handleSubmit = useCallback(async () => {
    startProcessing();

    await (data.addressType === 'shipping' ? addShippingAddress : addBillingAddress)({
      ...addressToAccountAddress(data),
      isDefaultShippingAddress: data.addressType === 'shipping' && saveAsDefault,
      isDefaultBillingAddress: data.addressType === 'billing' && saveAsDefault,
    });

    stopProcessing();
    onAfterSubmit?.();
    setData(initialData);
    setSaveAsDefault(false);
  }, [
    addShippingAddress,
    addBillingAddress,
    data,
    addressToAccountAddress,
    saveAsDefault,
    startProcessing,
    stopProcessing,
    onAfterSubmit,
    initialData,
  ]);

  const addressTypeOptions = useMemo(() => {
    return [
      {
        label: translate('checkout.shippingAddress'),
        value: 'shipping',
      },
      { label: translate('checkout.billingAddress'), value: 'billing' },
    ];
  }, [translate]);

  const fields = useCallback(
    ({ enableAddress2, onEnableAddress2 }: FieldsOptions) => {
      return [
        {
          name: 'firstName',
          label: translate('common.firstName'),
          labelDesc: '',
          required: true,
          type: 'string',
          className: 'col-span-12',
        },
        {
          name: 'lastName',
          label: translate('common.lastName'),
          labelDesc: '',
          required: true,
          type: 'string',
          className: 'col-span-12',
        },
        {
          name: 'line1',
          label: translate('common.address'),
          labelDesc: '',
          required: true,
          type: 'string',
          className: 'col-span-12',
          render() {
            if (enableAddress2) return <></>;

            return (
              <div className="col-span-12 mt-16 cursor-pointer">
                {/* eslint-disable-next-line react/jsx-no-literals */}
                <p className="w-fit text-14 text-gray-600" onClick={onEnableAddress2}>
                  + {translate('checkout.add-address')}
                </p>
              </div>
            );
          },
        },
        ...(enableAddress2
          ? [
              {
                name: 'line2',
                label: `${translate('common.address')} 2`,
                labelDesc: '',
                type: 'string',
                className: 'col-span-12',
              },
            ]
          : []),
        {
          name: 'postalCode',
          label: translate('common.zipCode'),
          labelDesc: '',
          required: true,
          className: 'col-span-3 mt-12',
        },
        {
          name: 'city',
          label: translate('common.city'),
          labelDesc: '',
          required: true,
          className: 'col-span-9 mt-12',
        },
      ] as Fields[];
    },
    [translate],
  );

  if (!loggedIn) return <></>;

  return (
    <div>
      <p className="text-14 font-semibold uppercase">
        {translate(addressType === 'shipping' ? 'checkout.add-shipping-address' : 'checkout.add-billing-address')}
      </p>
      <AddressForm className="mt-32" address={data} fields={fields} onChange={handleChange} onSubmit={handleSubmit}>
        <div className="mt-12">
          <Dropdown
            name="addressType"
            items={addressTypeOptions}
            className="w-full border-neutral-500"
            onChange={handleChange}
            label={`${translate('account.address-type')} *`}
            disabled
            value={data.addressType}
          />
        </div>
        <div className="mt-16">
          <Checkbox
            label={translate('account.address-setDefault')}
            labelPosition="on-right"
            checked={saveAsDefault}
            onChange={({ checked }) => setSaveAsDefault(checked)}
          />
        </div>
        <div className="mt-32 flex gap-12">
          <Button variant="secondary" className="px-48" type="button" onClick={onAfterSubmit}>
            {translate('common.cancel')}
          </Button>
          <Button variant="primary" className="px-48" type="submit" loading={processing}>
            {translate('common.save')}
          </Button>
        </div>
      </AddressForm>
    </div>
  );
};

export default CreateAddress;
