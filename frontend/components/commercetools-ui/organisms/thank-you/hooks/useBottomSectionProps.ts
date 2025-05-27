import { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import { useRouter } from 'i18n/routing';

type SectionProps = { title: string; subtitle: string; cta: string; onClick: () => void };
type BottomSectionDataType = { [key in 'user' | 'guest']: SectionProps };

const useBottomSectionProps = (loggedIn: boolean) => {
  const router = useRouter();
  const translate = useTranslations();

  const bottomSectionOptions: BottomSectionDataType = useMemo(() => {
    return {
      user: {
        title: translate('thank-you.user-title'),
        subtitle: translate('thank-you.user-subtitle'),
        cta: translate('thank-you.user-cta'),
        onClick: () => router.push('/account/?hash=orders'),
      },
      guest: {
        title: translate('thank-you.guest-title'),
        subtitle: translate('thank-you.guest-subtitle'),
        cta: translate('thank-you.guest-cta'),
        onClick: () => router.push('/register'),
      },
    };
  }, [translate, router]);

  const bottomSectionProps = useMemo(() => {
    return loggedIn ? bottomSectionOptions['user'] : bottomSectionOptions['guest'];
  }, [bottomSectionOptions, loggedIn]);

  return { bottomSectionProps };
};
export default useBottomSectionProps;
