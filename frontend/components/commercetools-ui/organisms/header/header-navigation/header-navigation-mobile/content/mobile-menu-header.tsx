import React, { FC } from 'react';
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import { ImageProps } from 'components/commercetools-ui/atoms/image';
import Typography from 'components/commercetools-ui/atoms/typography';
import HeaderLogo from 'components/commercetools-ui/organisms/header/header-logo';
import { Category } from 'types/entity/category';
import { Reference } from 'types/reference';

export interface Props {
  logo: ImageProps;
  logoLink: Reference;
  categories: Category[];
  onArrowClick: () => void;
  hideHeaderMenu: () => void;
}

const MobileMenuHeader: FC<Props> = ({ onArrowClick, logo, logoLink, hideHeaderMenu, categories }) => {
  const translate = useTranslations();
  return (
    <div className="flex h-52 w-full justify-between border-b border-neutral-400 px-20">
      {categories.length > 0 && (
        <div className="flex h-full items-center justify-start">
          <Button variant="ghost" size="fit" onClick={onArrowClick} className="px-0">
            <ChevronLeftIcon className="w-20 text-gray-600" />
          </Button>
        </div>
      )}
      {categories.length <= 0 ? (
        <HeaderLogo
          logo={logo}
          logoLink={logoLink}
          onClick={hideHeaderMenu}
          imageClassName="flex h-full w-160 justify-center text-center text-16 font-bold md:text-28"
        />
      ) : (
        <div className="flex w-full items-center justify-center whitespace-nowrap">
          <Typography className="text-center font-medium">{categories[categories.length - 1].name}</Typography>
        </div>
      )}
      <div className="flex h-full items-center justify-end">
        <Button variant="ghost" size="xs" onClick={hideHeaderMenu} title={translate('common.close')} className="px-0">
          <XMarkIcon className="w-24 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default MobileMenuHeader;
