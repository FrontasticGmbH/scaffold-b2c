import React from 'react';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import Typography from 'components/commercetools-ui/atoms/typography';

interface Props {
  phoneNumber?: string;
  workingHoursWeekdays?: string;
  workingHoursWeekends?: string;
  email?: string;
  addressLine?: string;
  cityAndPostalCode?: string;
  country?: string;
}

const ContactUs: React.FC<Props> = ({
  phoneNumber,
  workingHoursWeekdays,
  workingHoursWeekends,
  email,
  addressLine,
  cityAndPostalCode,
  country,
}) => {
  const translate = useTranslations();
  return (
    <div className="mt-24">
      <div className="border-b border-neutral-400 pb-20 lg:border-b-0 lg:py-40">
        <Typography as="h2" className="text-18">
          {translate('customer-support.contact-us')}
        </Typography>
      </div>

      <div className="hidden w-full border-b border-neutral-400 px-12 pb-20 lg:flex">
        <div className="flex w-[30%]">
          <PhoneIcon className="w-20" />
          <Typography className="py-1 pl-16 text-14 font-medium text-primary">
            {translate('customer-support.phone')}
          </Typography>
        </div>

        <div className="flex w-[30%]">
          <EnvelopeIcon className="w-20" />
          <Typography className="py-1 pl-16 text-14 font-medium text-primary">
            {translate('customer-support.email')}
          </Typography>
        </div>

        <div className="flex w-[30%]">
          <MapPinIcon className="w-20" />
          <Typography className="py-1 pl-16 text-14 font-medium text-primary">
            {translate('customer-support.address')}
          </Typography>
        </div>
      </div>

      <div className="flex w-full flex-col lg:flex-row lg:pt-16">
        <div className="flex w-[30%] py-20 lg:hidden">
          <PhoneIcon className="w-20" />
          <Typography className="py-1 pl-14 text-14 font-medium text-primary">
            {translate('customer-support.phone')}
          </Typography>
        </div>

        <div className="flex flex-col border-b pb-20 pl-0 lg:w-[30%] lg:border-b-0 lg:pl-48">
          <Typography className="py-1 text-14 text-gray-600">{phoneNumber}</Typography>
          {workingHoursWeekdays && (
            <div className="pt-22">
              <Typography as="span" className="text-14 text-gray-600">
                {translate('customer-support.weekdays')}
              </Typography>
              <Typography as="span" className="text-14 text-gray-600">
                {workingHoursWeekdays}
              </Typography>
            </div>
          )}
          {workingHoursWeekends && (
            <div>
              <Typography as="span" className="text-14 text-gray-600">
                {translate('customer-support.weekends')}
              </Typography>
              <Typography as="span" className="text-14 text-gray-600">
                {workingHoursWeekends}
              </Typography>
            </div>
          )}
        </div>

        <div className="flex w-[30%] py-20 lg:hidden">
          <EnvelopeIcon className="w-20" />
          <Typography as="h5" className="py-1 pl-14 text-14 font-medium text-primary">
            {translate('customer-support.email')}
          </Typography>
        </div>
        <div className="flex border-b pb-20 pl-0 lg:w-[30%] lg:border-b-0 lg:pl-42">
          <Typography className="py-1 text-14 text-gray-600">{email}</Typography>
        </div>

        <div className="flex w-[30%] py-20 lg:hidden">
          <MapPinIcon className="w-20" />
          <Typography className="py-1 pl-14 text-14 font-medium text-primary">
            {translate('customer-support.address')}
          </Typography>
        </div>
        <div className="flex flex-col border-b pb-20 pl-0 lg:w-[30%] lg:border-b-0 lg:pl-34">
          <Typography as="span" className="pb-4 text-14 text-gray-600">
            {addressLine}
          </Typography>
          <Typography as="span" className="pb-4 text-14 text-gray-600">
            {cityAndPostalCode}
          </Typography>
          <Typography as="span" className="text-14 text-gray-600">
            {country}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
