import { FC } from 'react';
import { Account } from 'shared/types/account';
import { useTranslations } from 'use-intl';
import Typography from 'components/commercetools-ui/atoms/typography';
import PrintButton from './printButton';

type ThankYouHeaderProps = {
  email?: Account['email'];
  onPrint: (e: React.FormEvent) => void;
};

const ThankYouHeader: FC<ThankYouHeaderProps> = ({ email, onPrint }) => {
  const translate = useTranslations();

  return (
    <div className="grid justify-items-center gap-24 border-b border-neutral-400 pb-24 pt-16 md:border-b-0 lg:justify-items-start lg:p-0">
      {/* Title */}
      <Typography
        as="h3"
        asSkeleton={!email}
        className={`text-primary md:text-18 lg:text-22 ${email ? 'leading-tight' : 'leading-loose'}`}
      >
        {translate('thank-you.thank-for-order')}
      </Typography>

      {/* Subtitle */}
      <div className="flex flex-col items-center gap-5 md:flex-row">
        <Typography asSkeleton={!email} className="text-14 leading-loose text-primary md:text-16">
          {translate('thank-you.email-sent')}
        </Typography>
        <Typography asSkeleton={!email} className="text-14 font-medium leading-loose text-primary md:text-16">
          {email ?? 'example@email.com'}
        </Typography>
      </div>

      <PrintButton asSkeleton={!email} onPrint={onPrint} className="w-full py-8 md:w-fit md:px-68 lg:hidden" />
    </div>
  );
};

export default ThankYouHeader;
