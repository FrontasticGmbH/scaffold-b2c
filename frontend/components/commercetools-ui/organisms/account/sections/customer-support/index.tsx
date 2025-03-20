import React from 'react';
import { useTranslations } from 'use-intl';
import ContactUs from './contact-us';
import FAQuestions from './faq';
import { FAQ } from '../..';

interface Props {
  phoneNumber: string;
  workingHoursWeekdays: string;
  workingHoursWeekends: string;
  email: string;
  addressLine: string;
  cityAndPostalCode: string;
  country: string;
  faqs: FAQ[];
}

const CustomerSupport: React.FC<Props> = ({
  phoneNumber,
  workingHoursWeekdays,
  workingHoursWeekends,
  email,
  addressLine,
  cityAndPostalCode,
  country,
  faqs,
}) => {
  const translate = useTranslations();
  return (
    <div className="mt-20 px-16 md:px-24 lg:mt-38 lg:px-44">
      <div className="hidden pb-12 md:block">
        <h1 className="text-22 text-primary lg:text-24">{translate('customer-support.customer-support')}</h1>
      </div>
      <div className="py-16">
        <p className="text-gray-600">{translate('customer-support.help-question')}</p>
      </div>

      <ContactUs
        phoneNumber={phoneNumber}
        workingHoursWeekdays={workingHoursWeekdays}
        workingHoursWeekends={workingHoursWeekends}
        email={email}
        addressLine={addressLine}
        cityAndPostalCode={cityAndPostalCode}
        country={country}
      />

      <FAQuestions faqs={faqs} />
    </div>
  );
};

export default CustomerSupport;
