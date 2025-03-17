import { FC } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'use-intl';
import AccordionBtn from 'components/commercetools-ui/atoms/accordion';

const Markdown = dynamic(() => import('../../../markdown'));

type AdditionalInfoProps = {
  productspec?: string;
  description?: string;
};

const AdditionalInfo: FC<AdditionalInfoProps> = ({ productspec, description }) => {
  const translate = useTranslations();

  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="additional-info col-span-2">
      <style>
        {`
        .additional-info ul {
          padding: 0 !important;
          list-style: inside circle;
        }

        .additional-info li {
          --tw-text-opacity: 1;
          color: rgb(33 33 33 / var(--tw-text-opacity));
          line-height: 150%;
          font-weight: 400;
          font-size: 14px;
          font-family: Inter, sans-serif;
      `}
      </style>

      {description && (
        <AccordionBtn
          className="col-span-2 mt-24 border-y border-neutral-400 md:mt-0"
          closedSectionTitle={translate('product.product-desc')}
          buttonClassName="py-21 font-body text-16 leading-tight text-primary pl-0 md:pr-12"
          panelClassName="pb-20 md:pt-10 md:pb-30 text-primary"
        >
          <p
            className="font-body text-14 font-regular leading-loose text-primary"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </AccordionBtn>
      )}
      {productspec && (
        <AccordionBtn
          className="col-span-2 border-b border-neutral-400 md:mt-0"
          closedSectionTitle={translate('product.details-additional')}
          buttonClassName="py-21 font-body text-16 leading-tight text-primary pl-0 md:pr-12"
          panelClassName="pb-20 md:pt-10 md:pb-30 text-primary"
        >
          <Markdown
            className="block font-body text-14 font-regular leading-loose text-primary"
            markdown={productspec}
          />
        </AccordionBtn>
      )}
    </div>
  );
};

export default AdditionalInfo;
