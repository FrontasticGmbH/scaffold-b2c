import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useFormat } from 'helpers/hooks/useFormat';

type SectionProps = { title: string; subtitle: string; cta: string; onClick: () => void };
type BottomSectionDataType = { [key in 'user' | 'guest']: SectionProps };

const useBottomSectionProps = (loggedIn: boolean) => {
  const router = useRouter();
  const { formatMessage } = useFormat({ name: 'thank-you' });

  const bottomSectionOptions: BottomSectionDataType = useMemo(() => {
    return {
      user: {
        title: formatMessage({ id: 'user.title', defaultMessage: 'My orders' }),
        subtitle: formatMessage({ id: 'user.subtitle', defaultMessage: 'Manage, review or track your order.' }),
        cta: formatMessage({ id: 'user.cta', defaultMessage: 'Review order status' }),
        onClick: () => router.push('/account#orders'),
      },
      guest: {
        title: formatMessage({ id: 'guest.title', defaultMessage: 'Save your details' }),
        subtitle: formatMessage({
          id: 'guest.subtitle',
          defaultMessage: 'Enjoy faster checkout, order history and personal offers.',
        }),
        cta: formatMessage({ id: 'guest.cta', defaultMessage: 'Create account' }),
        onClick: () => router.push('/register'),
      },
    };
  }, [formatMessage, router]);

  const bottomSectionProps = useMemo(() => {
    return loggedIn ? bottomSectionOptions['user'] : bottomSectionOptions['guest'];
  }, [bottomSectionOptions, loggedIn]);

  return { bottomSectionProps };
};
export default useBottomSectionProps;
