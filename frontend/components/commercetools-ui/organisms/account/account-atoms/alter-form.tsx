import { FC, useMemo } from 'react';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import { useRouter } from 'i18n/routing';

type AlterFormProps = {
  page: 'login' | 'register';
};
type PageBasedData = { [key in AlterFormProps['page']]: { title: string; buttonLabel: string; link: string } };

const AlterForm: FC<AlterFormProps> = ({ page }) => {
  const router = useRouter();
  const translate = useTranslations();

  const pageBasedData: PageBasedData = useMemo(() => {
    return {
      login: {
        title: translate('account.welcome-back'),
        buttonLabel: translate('account.sign-in'),
        link: '/login',
      },
      register: {
        title: translate('account.not-member-yet'),
        buttonLabel: translate('account.account-register'),
        link: '/register',
      },
    };
  }, [translate]);

  const title = useMemo(() => pageBasedData[page].title, [page, pageBasedData]);
  const buttonLabel = useMemo(() => pageBasedData[page].buttonLabel, [page, pageBasedData]);

  const handleClick = () => {
    router.push(pageBasedData[page].link);
  };

  return (
    <div className="mt-36 border-t border-t-neutral-400 pt-40 md:mt-56 md:pt-56 lg:mt-84 lg:pt-84">
      <div className="m-auto grid max-w-screen-sm px-16">
        <h3 className="text-16 text-primary md:text-20 lg:text-24">{title}</h3>
        <Button
          className="mt-16 h-32 py-0 font-medium md:mt-24 md:h-40 md:text-16"
          variant="secondary"
          onClick={handleClick}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default AlterForm;
