import React, { FC, useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import Button from 'components/commercetools-ui/atoms/button';
import Drawer from 'components/commercetools-ui/atoms/drawer';
import { ImageProps } from 'components/commercetools-ui/atoms/image';
import { Category } from 'types/entity/category';
import { Reference } from 'types/reference';
import MobileMenu from './content/mobile-menu';
import MobileMenuFooter from './content/mobile-menu-footer';
import MobileMenuHeader from './content/mobile-menu-header';

export interface Props {
  logo: ImageProps;
  logoLink: Reference;
  links: Category[];
}

const HeaderNavigationMobile: FC<Props> = ({ links, logo, logoLink }) => {
  const translate = useTranslations();
  const [categoriesNavigator, setCategoriesNavigator] = useState<Category[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  const showHeaderMenu = () => {
    setShowMenu(true);
  };

  const hideHeaderMenu = () => {
    setShowMenu(false);
    setCategoriesNavigator([]);
  };

  const removeCategory = () => {
    setCategoriesNavigator((array) => array.slice(0, -1));
  };

  const insertCategory = (category: Category) => {
    setCategoriesNavigator((array) => [...array, category]);
  };

  return (
    <div className="flex xl:hidden">
      <Button
        variant="ghost"
        size="fit"
        onClick={showHeaderMenu}
        title={translate('common.header-menu-open')}
        className="mr-8"
      >
        <Bars3Icon className="w-30 text-gray-600 lg:w-48" />
      </Button>

      <Drawer
        isOpen={showMenu}
        direction="left"
        className="w-4/5 border border-neutral-400 bg-white"
        onClose={hideHeaderMenu}
      >
        <MobileMenuHeader
          categories={categoriesNavigator}
          hideHeaderMenu={hideHeaderMenu}
          logo={logo}
          logoLink={logoLink}
          onArrowClick={removeCategory}
        />

        <MobileMenu
          links={links}
          hideHeaderMenu={hideHeaderMenu}
          categoriesNavigator={categoriesNavigator}
          insertCategory={insertCategory}
        />

        {categoriesNavigator.length <= 0 && (
          <MobileMenuFooter showMenu={showMenu} hideHeaderMenu={hideHeaderMenu} insertCategory={insertCategory} />
        )}
      </Drawer>
    </div>
  );
};

export default HeaderNavigationMobile;
