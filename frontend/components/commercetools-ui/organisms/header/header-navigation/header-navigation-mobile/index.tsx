import React, { FC, useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Category } from 'shared/types/product/Category';
import Button from 'components/commercetools-ui/atoms/button';
import Drawer from 'components/commercetools-ui/atoms/drawer';
import { useFormat } from 'helpers/hooks/useFormat';
import { Reference } from 'types/reference';
import { ImageProps } from 'frontastic/lib/image';
import MobileMenu from './content/mobile-menu';
import MobileMenuFooter from './content/mobile-menu-footer';
import MobileMenuHeader from './content/mobile-menu-header';

export interface Props {
  logo: ImageProps;
  logoLink: Reference;
  links: Category[];
}

const HeaderNavigationMobile: FC<Props> = ({ links, logo, logoLink }) => {
  const { formatMessage } = useFormat({ name: 'common' });
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
        title={formatMessage({ id: 'header.menu.open', defaultMessage: 'Open side menu' })}
        className="mr-8"
      >
        <Bars3Icon className="w-30 text-secondary-black lg:w-48" />
      </Button>

      <Drawer
        isOpen={showMenu}
        direction="left"
        className="w-4/5 border border-neutral-400 bg-neutral-100"
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
