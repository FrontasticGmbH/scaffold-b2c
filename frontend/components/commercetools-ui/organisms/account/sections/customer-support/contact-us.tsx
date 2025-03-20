import React from 'react';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';

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
        <h2 className="text-18">{translate('customer-support.contact-us')}</h2>
      </div>

      <div className="hidden w-full border-b border-neutral-400 px-12 pb-20 lg:flex">
        <div className="flex w-[30%]">
          <PhoneIcon className="w-20" />
          <p className="py-1 pl-16 text-14 font-medium text-primary">{translate('customer-support.phone')}</p>
        </div>

        <div className="flex w-[30%]">
          <EnvelopeIcon className="w-20" />
          <p className="py-1 pl-16 text-14 font-medium text-primary">{translate('customer-support.email')}</p>
        </div>

        <div className="flex w-[30%]">
          <MapPinIcon className="w-20" />
          <p className="py-1 pl-16 text-14 font-medium text-primary">{translate('customer-support.address')}</p>
        </div>
      </div>

      <div className="flex w-full flex-col lg:flex-row lg:pt-16">
        <div className="flex w-[30%] py-20 lg:hidden">
          <PhoneIcon className="w-20" />
          <p className="py-1 pl-14 text-14 font-medium text-primary">{translate('customer-support.phone')}</p>
        </div>

        <div className="flex flex-col border-b pb-20 pl-0 lg:w-[30%] lg:border-b-0 lg:pl-48">
          <p className="py-1 text-14 text-gray-600">{phoneNumber}</p>
          {workingHoursWeekdays && (
            <div className="pt-22">
              <span className="text-14 text-gray-600">{translate('customer-support.weekdays')}</span>
              <span className="text-14 text-gray-600">{workingHoursWeekdays}</span>
            </div>
          )}
          {workingHoursWeekends && (
            <div>
              <span className="text-14 text-gray-600">{translate('customer-support.weekends')}</span>
              <span className="text-14 text-gray-600">{workingHoursWeekends}</span>
            </div>
          )}
        </div>

        <div className="flex w-[30%] py-20 lg:hidden">
          <EnvelopeIcon className="w-20" />
          <h5 className="py-1 pl-14 text-14 font-medium text-primary">{translate('customer-support.email')}</h5>
        </div>
        <div className="flex border-b pb-20 pl-0 lg:w-[30%] lg:border-b-0 lg:pl-42">
          <p className="py-1 text-14 text-gray-600">{email}</p>
        </div>

        <div className="flex w-[30%] py-20 lg:hidden">
          <MapPinIcon className="w-20" />
          <p className="py-1 pl-14 text-14 font-medium text-primary">{translate('customer-support.address')}</p>
        </div>
        <div className="flex flex-col border-b pb-20 pl-0 lg:w-[30%] lg:border-b-0 lg:pl-34">
          <span className="pb-4 text-14 text-gray-600">{addressLine}</span>
          <span className="pb-4 text-14 text-gray-600">{cityAndPostalCode}</span>
          <span className="text-14 text-gray-600">{country}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
