import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Button from 'components/commercetools-ui/atoms/button';
import { AccountContext } from 'context/account';
import { useRouter } from 'i18n/routing';
import { useProjectSettings } from 'frontastic';
import useSession from 'frontastic/hooks/useSession';

interface Props {
  isActive: boolean;
  isCompleted: boolean;
  translations?: {
    review?: string;
  };
  onCompletePayment: (paymentMethodId: string, data: unknown) => Promise<void>;
  goToNextStep: () => void;
  setCheckoutIsProcessing: (processing: boolean) => void;
}

const CommercetoolsPayment = ({
  isActive,
  isCompleted,
  translations,
  onCompletePayment,
  goToNextStep,
  setCheckoutIsProcessing,
}: Props) => {
  const router = useRouter();

  const initiatedCheckout = useRef(false);

  const errorTriggered = useRef(false);

  const { account, logout } = useContext(AccountContext);

  const [loading, setLoading] = useState(false);

  const { session, isExpired } = useSession();

  const { locale } = useParams();

  const { projectSettings } = useProjectSettings();

  const translate = useTranslations();

  const projectKey = projectSettings?.projectKey;
  const region = projectSettings?.region;

  const handleStepCompletion = useCallback(
    async (paymentMethodId: string) => {
      setLoading(true);

      await onCompletePayment?.(paymentMethodId, {});

      goToNextStep();

      setLoading(false);
    },
    [onCompletePayment, goToNextStep],
  );

  useEffect(() => {
    if (initiatedCheckout.current || !projectKey || !region || !session?.token || !isActive) return;

    initiatedCheckout.current = true;

    import('@commercetools/checkout-browser-sdk').then((module) => {
      module.paymentFlow({
        projectKey,
        region,
        sessionId: session.token,
        locale,
        onError(message) {
          switch (message.code) {
            case 'payment_failed':
              setCheckoutIsProcessing(false);

              toast.error(translate('checkout.wentWrong'), { position: 'top-right' });

              break;
          }
        },
        onInfo(message) {
          switch (message.code) {
            case 'payment_method_selection_confirmation':
              const { method } = message.payload as { method: { type: string } };

              handleStepCompletion(method.type);

              break;
            case 'payment_validation_started':
              setCheckoutIsProcessing(true);

              break;

            case 'checkout_completed':
              setCheckoutIsProcessing(false);

              const { order } = message.payload as { order: { id: string } };

              router.push(`${process.env.NEXT_PUBLIC_COMMERCETOOLS_CHECKOUT_CALLBACK_URL}?orderId=${order.id}`);

              break;
          }
        },
      });
    });
  }, [
    projectKey,
    region,
    session?.token,
    locale,
    handleStepCompletion,
    isActive,
    router,
    setCheckoutIsProcessing,
    translate,
  ]);

  useEffect(() => {
    if (!isActive) initiatedCheckout.current = false;
  }, [isActive]);

  useEffect(() => {
    if (account?.accountId && isExpired && !errorTriggered.current) {
      errorTriggered.current = true;
      logout().then(() => {
        router.push('/login');
        toast.error(translate('checkout.your-token-has-expired'), { position: 'top-right' });
      });
    }
  }, [isExpired, router, logout, translate, account]);

  return (
    <div>
      <div data-ctc />

      {!isCompleted && (
        <Button
          type="submit"
          className="mt-9 w-full md:w-fit"
          size="l"
          variant="primary"
          loading={loading}
          data-ctc-selector="confirmMethod"
        >
          {translations?.review ?? translate('cart.review-order')}
        </Button>
      )}
    </div>
  );
};

export default CommercetoolsPayment;
