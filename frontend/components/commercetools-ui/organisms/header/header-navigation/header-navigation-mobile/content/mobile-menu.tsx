import React, { FC } from 'react';
import { useTranslations } from 'use-intl';
import Link from 'components/commercetools-ui/atoms/link';
import { Category } from 'types/entity/category';
import MobileMenuNavButton from '../atoms/menu-nav-button';

export interface Props {
  links: Category[];
  hideHeaderMenu: () => void;
  categoriesNavigator?: Category[]; //This is a navigator where you push a descendant to show it's contents
  insertCategory: (category: Category) => void;
}

const MobileMenu: FC<Props> = ({ links, categoriesNavigator, insertCategory, hideHeaderMenu }) => {
  const translate = useTranslations();
  return (
    <div className="ml-24 mr-22">
      {categoriesNavigator && categoriesNavigator?.length > 0 && (
        <div className="pt-24">
          {categoriesNavigator[categoriesNavigator.length - 1]?.categoryId != 'myAccount' && (
            <div className="pb-36" onClick={hideHeaderMenu}>
              <Link
                link={
                  categoriesNavigator[categoriesNavigator.length - 1]?._url ??
                  categoriesNavigator[categoriesNavigator.length - 1]?.slug
                }
              >
                <p className="text-primary">{translate('common.view-all')}</p>
              </Link>
            </div>
          )}
        </div>
      )}
      {categoriesNavigator && categoriesNavigator.length <= 0 ? (
        links?.map((link) => (
          <MobileMenuNavButton
            key={link.categoryId}
            categoriesNavigator={categoriesNavigator}
            link={link}
            onClick={() => insertCategory(link)}
            hideHeaderMenu={hideHeaderMenu}
          />
        ))
      ) : (
        <>
          {categoriesNavigator &&
            categoriesNavigator[categoriesNavigator.length - 1].descendants?.map((nav) => (
              <MobileMenuNavButton
                key={nav.categoryId}
                categoriesNavigator={categoriesNavigator}
                link={nav}
                onClick={() => insertCategory(nav)}
                hideHeaderMenu={hideHeaderMenu}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default MobileMenu;
