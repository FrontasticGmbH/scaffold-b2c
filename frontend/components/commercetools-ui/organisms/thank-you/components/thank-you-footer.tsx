import { FC, useContext } from 'react';
import Button from 'components/commercetools-ui/atoms/button';
import Typography from 'components/commercetools-ui/atoms/typography';
import { AccountContext } from 'context/account';
import useBottomSectionProps from '../hooks/useBottomSectionProps';

type ThankYouFooterProps = {
  loading: boolean;
};

const ThankYouFooter: FC<ThankYouFooterProps> = ({ loading }) => {
  const { loggedIn } = useContext(AccountContext);

  const { bottomSectionProps } = useBottomSectionProps(loggedIn);

  return (
    <div className="grid border-b border-neutral-400 pb-24 pt-16 md:border-b-0 lg:pb-0 lg:pt-36">
      <Typography
        as="h3"
        className="mb-16 w-fit leading-[20px] text-primary md:mb-24 md:text-18 md:leading-normal lg:text-22"
        asSkeleton={loading}
      >
        {bottomSectionProps?.title}
      </Typography>
      <Typography className="mb-24 w-fit text-14 text-gray-600 md:text-16" asSkeleton={loading}>
        {bottomSectionProps?.subtitle}
      </Typography>
      <Button
        className="w-full py-8 md:w-fit md:px-56 md:py-12"
        asSkeleton={loading}
        onClick={bottomSectionProps.onClick}
      >
        {bottomSectionProps?.cta}
      </Button>
    </div>
  );
};

export default ThankYouFooter;
