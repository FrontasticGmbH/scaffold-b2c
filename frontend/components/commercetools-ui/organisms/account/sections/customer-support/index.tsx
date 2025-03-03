import React from 'react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { useFormat } from 'helpers/hooks/useFormat';
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
  const { formatMessage: formatCustomerSupportMessage } = useFormat({ name: 'customer-support' });
  return (
    <div className="mt-20 px-16 md:px-24 lg:mt-38 lg:px-44">
      <div className="hidden pb-12 md:block">
        <Typography as="h2" className="text-22 text-primary lg:text-24">
          {formatCustomerSupportMessage({
            id: 'customer.support',
            defaultMessage: 'Customer support',
          })}
        </Typography>
      </div>
      <div className="py-16">
        <Typography className="text-gray-600">
          {formatCustomerSupportMessage({ id: 'help.question', defaultMessage: 'How can we help you today?' })}
        </Typography>
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
