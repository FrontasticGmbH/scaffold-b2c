import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import OrderItemsListing from 'components/commercetools-ui/organisms/order-items-listing';
import OrderPaymentSection from 'components/commercetools-ui/organisms/order-payment-section';
import DiscountForm from 'components/commercetools-ui/organisms/order-payment-section/components/discount-form';
import { useCart } from 'frontastic';
import { useCheckout } from '../../provider';

interface Props {
  isFinalStep: boolean;
  onPurchase: () => void;
}

const Summary: React.FC<Props> = ({ isFinalStep, onPurchase }) => {
  const translate = useTranslations();

  const accordionRef = useRef<HTMLDivElement>(null);

  const { data } = useCart();

  const { processing } = useCheckout();

  useEffect(() => {
    if (isFinalStep && accordionRef.current) {
      accordionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isFinalStep]);

  return (
    <div className="bg-white lg:mt-0 lg:min-w-[35%] lg:p-36">
      <h3 className="p-16 leading-[22px] text-primary md:p-24 md:text-18 lg:px-0 lg:pt-0">
        {translate('cart.order-summary')}
      </h3>

      {data?.lineItems && <OrderItemsListing className="border-t border-neutral-400" lineItems={data?.lineItems} />}

      <OrderPaymentSection
        discounts={[]}
        onApplyDiscountCode={async () => {}}
        onRemoveDiscountCode={async () => {}}
        className="mt-16 hidden bg-white py-16 pb-24 text-16 lg:block lg:pb-0"
        classNames={{
          applyDiscountButton: 'py-14 text-16',
          totalAmount: 'text-18 md:pb-20',
          subCostsContainer: 'pt-12 md:pt-16 mb-20 lg:py-24 lg:mb-16 lg:border-b border-neutral-400',
        }}
        button={
          <Button
            variant="primary"
            disabled={!isFinalStep}
            className="w-full"
            type="submit"
            onClick={onPurchase}
            loading={processing}
          >
            {translate('cart.complete-purchase')}
          </Button>
        }
      />

      <DiscountForm
        discounts={[]}
        onApplyDiscountCode={async () => {}}
        onRemoveDiscountCode={async () => {}}
        className="border-transparent lg:hidden"
        accordionProps={{
          closedSectionTitle: translate('checkout.discount-apply'),
          buttonClassName: 'text-gray-600 border-b border-neutral-400 pb-16',
          buttonWrapperClassName: 'px-16 md:px-24 lg:px-0',
          panelClassName: 'px-16 md:px-24 lg:px-0',
          iconClassName: 'w-24',
        }}
      />
    </div>
  );
};

export default Summary;
