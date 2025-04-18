import React, { ComponentProps, FC } from 'react';
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
  titleTag?: 'h2' | 'h3';
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
  titleTag = 'h2',
}) => {
  const cardFullClassName = useClassNames([
    { 'flex items-start justify-between': !!isEditable },
    { 'py-24 px-16 md:px-24 md:pr-28 lg:pr-44': !clearPadding },
    'rounded-sm border border-neutral-400',
    cardClassName,
  ]);

  const TitleTag = titleTag;

  return (
    <div className={className}>
      <TitleTag className="mb-16 text-primary md:text-18 lg:mb-24">{title}</TitleTag>

      <div className={cardFullClassName}>
        {children}

        {infoFields && <InfoFields fields={infoFields} />}

        {isEditable && editHref && <EditCTA editHref={editHref} />}
      </div>
    </div>
  );
};

export default InfoCard;
