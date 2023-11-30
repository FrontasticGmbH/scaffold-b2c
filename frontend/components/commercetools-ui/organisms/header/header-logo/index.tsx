import React, { FC } from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import { Reference } from 'types/reference';
import Image, { ImageProps } from 'frontastic/lib/image';

export interface Props {
  logo: ImageProps;
  logoLink: Reference;
  imageClassName?: string;
  onClick?: () => void;
}

const HeaderLogo: FC<Props> = ({ logoLink, logo, imageClassName, onClick }) => {
  return (
    <div className="relative px-10 md:mt-0" onClick={onClick}>
      <Link className={imageClassName} link={logoLink}>
        <Image media={logo?.media} fill style={{ objectFit: 'contain' }} alt={logo?.title} />
      </Link>
    </div>
  );
};

export default HeaderLogo;
