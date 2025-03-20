import React from 'react';
import { useTranslations } from 'use-intl';
import AccordionBtn from 'components/commercetools-ui/atoms/accordion';
import { FAQ as FAQShape } from '../..';

interface Props {
  faqs: FAQShape[];
}

const FAQ: React.FC<Props> = ({ faqs }) => {
  const translate = useTranslations();
  return (
    <div className="pb-24 md:pb-36 lg:pb-0">
      <div className="py-24">
        <h3 className="text-18">{translate('customer-support.faq')}</h3>
      </div>

      <div className="grid gap-y-16">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-md border border-neutral-400">
            <AccordionBtn
              variant="plusAndMinus"
              iconClassName="text-primary"
              closedSectionTitle={faq.question}
              buttonClassName="font-medium text-16 py-20 px-16 text-primary"
            >
              <p className="pb-20 pl-16 pr-24 leading-loose text-gray-600">{faq.answer}</p>
            </AccordionBtn>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
