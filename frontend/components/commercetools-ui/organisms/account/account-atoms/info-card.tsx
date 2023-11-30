import React, { ComponentProps, FC } from 'react';
import Typography from 'components/commercetools-ui/atoms/typography';
import useClassNames from 'helpers/hooks/useClassNames';
import EditCTA from './edit-cta';
import InfoFields from './info-fields';

export type InfoField = { label: string; value: string };

interface InfoCardProps extends ComponentProps<'div'> {
  title: string;
  isEditable?: boolean;
  infoFields?: Array<InfoField>;
  cardClassName?: string;
  clearPadding?: boolean;
  editHref?: string;
}

const InfoCard: FC<InfoCardProps> = ({
  children,
  infoFields,
  className,
  cardClassName,
  title,
  isEditable,
  clearPadding,
  editHref,
}) => {
  const cardFullClassName = useClassNames([
    { 'flex items-center justify-between': !!isEditable },
    { 'py-24 px-16 md:px-24 md:pr-28 lg:pr-44': !clearPadding },
    'rounded-sm border border-neutral-400',
    cardClassName,
  ]);

  return (
    <div className={className}>
      <Typography as="h4" className="mb-16 text-primary-black md:text-18 lg:mb-24">
        {title}
      </Typography>

      <div className={cardFullClassName}>
        {children}

        {infoFields && <InfoFields fields={infoFields} />}

        {isEditable && editHref && <EditCTA editHref={editHref} />}
      </div>
    </div>
  );
};

export default InfoCard;
