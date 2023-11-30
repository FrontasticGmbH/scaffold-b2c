import React from 'react';
import AccordionBtn from 'components/commercetools-ui/atoms/accordion';
import Typography from 'components/commercetools-ui/atoms/typography';
import { useFormat } from 'helpers/hooks/useFormat';
import { FAQ as FAQShape } from '../..';

interface Props {
  faqs: FAQShape[];
}

const FAQ: React.FC<Props> = ({ faqs }) => {
  const { formatMessage: formatCustomerSupportMessage } = useFormat({ name: 'customer-support' });
  return (
    <div className="pb-24 md:pb-36 lg:pb-0">
      <div className="py-24">
        <Typography as="h3" className="text-18">
          {formatCustomerSupportMessage({ id: 'faq', defaultMessage: 'FAQ' })}
        </Typography>
      </div>

      <div className="grid gap-y-16">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-md border border-neutral-400">
            <AccordionBtn
              variant="plusAndMinus"
              iconClassName="text-primary-black"
              closedSectionTitle={faq.question}
              buttonClassName="font-medium text-16 py-20 px-16 text-primary-black"
            >
              <Typography className="pb-20 pl-16 pr-24 leading-loose text-secondary-black">{faq.answer}</Typography>
            </AccordionBtn>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
