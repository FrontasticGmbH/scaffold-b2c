import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import usePath from 'helpers/hooks/usePath';
import { classnames } from 'helpers/utils/classnames';
import { useRouter } from 'i18n/routing';
import { Cart, ShippingMethod } from 'types/entity/cart';
import { CartDetails } from 'frontastic/hooks/useCart/types';
import AddressesPreview from './previews/addresses';
import ShippingPreview from './previews/shipping';
import Addresses from './sections/addresses';
import Shipping from './sections/shipping';
import { useCheckout } from '../../provider';
import Step from '../step';
import PaymentPreview from './previews/payment';
import CommercetoolsPayment from './sections/ct-payment';
import Payment from './sections/payment';

interface Props {
  cart?: Cart;
  isCtPaymentOnly?: boolean;
  shippingMethods: ShippingMethod[];
  onUpdateCart?: (payload: CartDetails) => Promise<Cart>;
  hasOutOfStockItems?: boolean;
  onPurchase: () => void;
  onFinalStepChange: (isFinalStep: boolean) => void;
}

const Steps: React.FC<Props> = ({
  cart,
  isCtPaymentOnly,
  shippingMethods,
  hasOutOfStockItems,
  onUpdateCart,
  onPurchase,
  onFinalStepChange,
}) => {
  const translate = useTranslations();

  const router = useRouter();

  const searchParams = useSearchParams();

  const step = +(searchParams.get('step') ?? 0);

  const { pathWithoutQuery } = usePath();

  const { processing, setProcessing } = useCheckout();

  const [active, setActive] = useState(0);
  const [peakActive, setPeakActive] = useState(step);

  const goToNextStep = useCallback(() => {
    setActive(active + 1);
    setPeakActive(Math.max(peakActive, active + 1));
    router.push(`${pathWithoutQuery}?step=${active + 1}`, { scroll: false });
  }, [active, peakActive, router, pathWithoutQuery]);

  const goToReview = useCallback(() => {
    setActive(peakActive);
  }, [peakActive]);

  useEffect(() => {
    setActive(step);
  }, [step]);

  const onEdit = useCallback((index: number) => setActive(index), []);

  const steps = useMemo(() => {
    return [
      {
        label: translate('cart.addresses'),
        Component: (
          <Addresses
            isCompleted={peakActive > 0}
            onUpdateCart={onUpdateCart}
            goToNextStep={goToNextStep}
            goToReview={goToReview}
          />
        ),
        Preview: <AddressesPreview cart={cart} />,
      },
      {
        label: translate('cart.shipping'),
        Component: <Shipping goToNextStep={goToNextStep} />,
        Preview: <ShippingPreview cart={cart} shippingMethods={shippingMethods} />,
      },
      ...[
        !isCtPaymentOnly
          ? {
              label: translate('cart.payment'),
              Component: <Payment goToNextStep={goToNextStep} />,
              Preview: <PaymentPreview />,
            }
          : {
              label: translate('cart.payment'),
              Component: (
                <CommercetoolsPayment
                  isActive={active === 2}
                  isCompleted={peakActive > 2}
                  setCheckoutIsProcessing={setProcessing}
                  goToNextStep={goToNextStep}
                  onCompletePayment={async () => {}}
                  hasOutOfStockItems={hasOutOfStockItems}
                />
              ),
            },
      ],
    ];
  }, [
    translate,
    peakActive,
    onUpdateCart,
    goToNextStep,
    goToReview,
    cart,
    shippingMethods,
    isCtPaymentOnly,
    active,
    setProcessing,
  ]);

  const isFinalStep = useMemo(() => active === steps.length, [active, steps.length]);

  useEffect(() => {
    onFinalStepChange(isFinalStep);
  }, [isFinalStep, onFinalStepChange]);

  return (
    <div className="lg:grow">
      <div className="flex flex-col gap-24 lg:bg-neutral-200">
        {steps.map(({ Component, Preview, label }, index) => (
          <Step
            key={index}
            label={label}
            number={index + 1}
            isExpanded={index === active}
            isCompleted={index < peakActive}
            onEdit={() => onEdit(index)}
            Component={Component}
            Preview={Preview}
          />
        ))}
      </div>
      <div className={classnames('mt-24 lg:hidden', { hidden: !isFinalStep })}>
        <Button
          variant="primary"
          className="w-full"
          type="submit"
          loading={processing}
          disabled={hasOutOfStockItems}
          {...(isCtPaymentOnly
            ? {
                'data-ctc-selector': 'paymentButton',
              }
            : {
                onClick: onPurchase,
              })}
        >
          {translate('cart.complete-purchase')}
        </Button>
      </div>
    </div>
  );
};

export default Steps;
