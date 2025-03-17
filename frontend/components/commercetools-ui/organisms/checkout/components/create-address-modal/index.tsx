import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Checkbox from 'components/commercetools-ui/atoms/checkbox';
import Dropdown from 'components/commercetools-ui/atoms/dropdown';
import Modal from 'components/commercetools-ui/organisms/modal';
import { AccountContext } from 'context/account';
import useGeo from 'helpers/hooks/useGeo';
import useI18n from 'helpers/hooks/useI18n';
import useProcessing from 'helpers/hooks/useProcessing';
import countryStates from 'public/static/states.json';
import AddressForm from '../steps/sections/addresses/components/address-form';
import { Fields, FieldsOptions } from '../steps/sections/addresses/components/address-form/types';
import useMappers from '../steps/sections/addresses/hooks/useMappers';
import { Address } from '../steps/sections/addresses/types';

const CreateAddressModal = () => {
  const translate = useTranslations();

  const { processing, startProcessing, stopProcessing } = useProcessing();

  const { getInfoByZipcode } = useGeo();

  const { addressToAccountAddress } = useMappers();

  const { addShippingAddress, addBillingAddress, loggedIn } = useContext(AccountContext);

  const { country } = useI18n();

  const states = countryStates[country as keyof typeof countryStates] ?? [];

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = useCallback(() => setIsOpen(false), []);

  const initialData = useMemo(() => ({ addressType: 'shipping' }) as Address, []);

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
    closeModal();
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
    closeModal,
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
          className: 'col-span-3',
        },
        {
          name: 'lastName',
          label: translate('common.lastName'),
          labelDesc: '',
          required: true,
          type: 'string',
          className: 'col-span-3',
        },
        {
          name: 'line1',
          label: translate('common.address'),
          labelDesc: '',
          required: true,
          type: 'string',
          className: 'col-span-3',
          render() {
            if (enableAddress2) return <></>;

            return (
              <div className="col-span-3 mt-16 cursor-pointer">
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
                className: 'col-span-3',
              },
            ]
          : []),
        {
          name: 'postalCode',
          label: translate('common.zipCode'),
          labelDesc: '',
          required: true,
          className: 'col-span-1 mt-12',
        },
        {
          name: 'city',
          label: translate('common.city'),
          labelDesc: '',
          required: true,
          className: 'col-span-2 mt-12',
        },
      ] as Fields[];
    },
    [translate],
  );

  if (!loggedIn) return <></>;

  return (
    <>
      <p className="text-14 underline underline-offset-2 hover:cursor-pointer" onClick={() => setIsOpen(true)}>
        {/* eslint-disable-next-line react/jsx-no-literals */}
        {translate('account.address-add')} +
      </p>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{ content: { background: 'transparent', border: 'none' } }}
        closeTimeoutMS={200}
      >
        <div className="mx-auto w-[90%] max-w-[600px] rounded-sm bg-white p-32 pt-24">
          <h4 className="text-24">{translate('account.address-add')}</h4>
          <AddressForm className="mt-32" address={data} fields={fields} onChange={handleChange} onSubmit={handleSubmit}>
            {states.length > 0 && (
              <div className="mt-12">
                <Dropdown
                  name="state"
                  value={data.state ?? ''}
                  items={[{ label: '', value: '' }, ...states.map(({ name, code }) => ({ label: name, value: code }))]}
                  className="w-full border-neutral-500"
                  onChange={handleChange}
                  label={translate('common.state')}
                />
              </div>
            )}
            <div className="mt-12">
              <Dropdown
                name="addressType"
                items={addressTypeOptions}
                className="w-full border-neutral-500"
                onChange={handleChange}
                label={`${translate('account.address-type')} *`}
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
              <Button variant="secondary" className="px-48" type="button" onClick={closeModal}>
                {translate('common.cancel')}
              </Button>
              <Button variant="primary" className="px-48" type="submit" loading={processing}>
                {translate('common.save')}
              </Button>
            </div>
          </AddressForm>
        </div>
      </Modal>
    </>
  );
};

export default CreateAddressModal;
