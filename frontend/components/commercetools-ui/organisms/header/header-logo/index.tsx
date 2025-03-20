import React, { FC } from 'react';
import { useLocale } from 'use-intl';
import Image, { ImageProps } from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';
import useImageSizes from 'helpers/hooks/useImageSizes';
import { Reference } from 'types/reference';

export interface Props {
  logo: ImageProps;
  logoLink: Reference;
  imageClassName?: string;
  onClick?: () => void;
}

const HeaderLogo: FC<Props> = ({ logoLink, logo, imageClassName, onClick }) => {
  const logoImageSizes = useImageSizes({ sm: 1, md: 0.5, lg: 0.15, defaultSize: 0.15 });
  const locale = useLocale();
  const availableLocales = logo?.title ? Object.keys(logo.title) : [];

  const matchingLocale = availableLocales.find((key) => key.startsWith(locale));

  return (
    <div className="relative px-10 md:mt-0" onClick={onClick}>
      <Link className={imageClassName} link={logoLink}>
        <Image
          media={logo?.media}
          fill
          style={{ objectFit: 'contain' }}
          alt={matchingLocale ? logo.title?.[matchingLocale] : 'Logo'}
          sizes={logoImageSizes}
        />
      </Link>
    </div>
  );
};

export default HeaderLogo;
