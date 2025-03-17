import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import usePath from 'helpers/hooks/usePath';
import { useRouter } from 'i18n/routing';
import { Cart, ShippingMethod } from 'types/entity/cart';
import { CartDetails } from 'frontastic/hooks/useCart/types';
import AddressesPreview from './previews/addresses';
import PaymentPreview from './previews/payment';
import ShippingPreview from './previews/shipping';
import Addresses from './sections/addresses';
import Payment from './sections/payment';
import Shipping from './sections/shipping';
import { useCheckout } from '../../provider';
import CreateAddressModal from '../create-address-modal';
import Step from '../step';

interface Props {
  cart?: Cart;
  shippingMethods: ShippingMethod[];
  onUpdateCart?: (payload: CartDetails) => Promise<Cart>;
  onPurchase: () => void;
  onFinalStepChange: (isFinalStep: boolean) => void;
}

const Steps: React.FC<Props> = ({ cart, shippingMethods, onUpdateCart, onPurchase, onFinalStepChange }) => {
  const translate = useTranslations();

  const router = useRouter();

  const searchParams = useSearchParams();

  const step = +(searchParams.get('step') ?? 0);

  const { pathWithoutQuery } = usePath();

  const { processing } = useCheckout();

  const [active, setActive] = useState<number>(0);

  const goToNextStep = useCallback(() => {
    setActive(active + 1);
    router.push(`${pathWithoutQuery}?step=${active + 1}`);
  }, [active, router, pathWithoutQuery]);

  useEffect(() => {
    setActive(step);
  }, [step]);

  const onEdit = useCallback((index: number) => setActive(index), []);

  const steps = useMemo(() => {
    return [
      {
        label: translate('cart.addresses'),
        Component: <Addresses onUpdateCart={onUpdateCart} goToNextStep={goToNextStep} />,
        Preview: <AddressesPreview cart={cart} />,
        CTA: <CreateAddressModal />,
      },
      {
        label: translate('cart.shipping'),
        Component: <Shipping goToNextStep={goToNextStep} />,
        Preview: <ShippingPreview cart={cart} shippingMethods={shippingMethods} />,
      },
      {
        label: translate('cart.payment'),
        Component: <Payment goToNextStep={goToNextStep} />,
        Preview: <PaymentPreview />,
      },
    ];
  }, [translate, goToNextStep, cart, shippingMethods, onUpdateCart]);

  const isFinalStep = useMemo(() => active === steps.length, [active, steps.length]);

  useEffect(() => {
    onFinalStepChange(isFinalStep);
  }, [isFinalStep, onFinalStepChange]);

  return (
    <div className="px-16 md:px-24 lg:grow lg:px-0">
      <div className="flex flex-col gap-24 lg:bg-neutral-200">
        {steps.map(({ Component, Preview, label, CTA }, index) => (
          <Step
            key={index}
            label={label}
            number={index + 1}
            isExpanded={index === active}
            isCompleted={index < active}
            onEdit={() => onEdit(index)}
            Component={Component}
            Preview={Preview}
            CTA={CTA}
          />
        ))}
      </div>
      {isFinalStep && (
        <div className="mt-24 lg:hidden">
          <Button variant="primary" className="w-full" type="submit" onClick={onPurchase} loading={processing}>
            {translate('cart.complete-purchase')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Steps;
