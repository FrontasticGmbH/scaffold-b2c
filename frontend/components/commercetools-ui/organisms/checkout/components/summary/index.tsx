import React, { useEffect, useRef } from 'react';
import Button from 'components/commercetools-ui/atoms/button';
import Typography from 'components/commercetools-ui/atoms/typography';
import OrderItemsListing from 'components/commercetools-ui/organisms/order-items-listing';
import OrderPaymentSection from 'components/commercetools-ui/organisms/order-payment-section';
import DiscountForm from 'components/commercetools-ui/organisms/order-payment-section/components/discount-form';
import { useFormat } from 'helpers/hooks/useFormat';
import { useCart } from 'frontastic';
import { useCheckout } from '../../provider';

interface Props {
  isFinalStep: boolean;
  onPurchase: () => void;
}

const Summary: React.FC<Props> = ({ isFinalStep, onPurchase }) => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });
  const { formatMessage: formatCheckoutMessage } = useFormat({ name: 'checkout' });

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
      <Typography as="h3" className="p-16 leading-[22px] text-primary-black md:p-24 md:text-18 lg:px-0 lg:pt-0">
        {formatCartMessage({ id: 'order.summary', defaultMessage: 'Order summary' })}
      </Typography>

      {data?.lineItems && <OrderItemsListing className="border-t border-neutral-400" lineItems={data?.lineItems} />}

      <OrderPaymentSection
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
            {formatCheckoutMessage({ id: 'complete.purchase', defaultMessage: 'Complete purchase' })}
          </Button>
        }
      />

      <DiscountForm
        className="border-transparent lg:hidden"
        accordionProps={{
          closedSectionTitle: formatCheckoutMessage({ id: 'discount.apply', defaultMessage: 'Apply a discount' }),
          buttonClassName: 'text-secondary-black border-b border-neutral-400 pb-16',
          buttonWrapperClassName: 'px-16 md:px-24 lg:px-0',
          panelClassName: 'px-16 md:px-24 lg:px-0',
          iconClassName: 'w-24',
        }}
      />
    </div>
  );
};

export default Summary;
