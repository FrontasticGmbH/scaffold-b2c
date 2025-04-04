import React, { FC } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'components/commercetools-ui/atoms/link';
import useClassNames from 'helpers/hooks/useClassNames';
import { Category } from 'types/entity/category';

export interface Props {
  link: Category;
  categoriesNavigator?: Category[];
  onClick: () => void;
  hideHeaderMenu: () => void;
}

const MobileMenuNavButton: FC<Props> = ({ link, categoriesNavigator, onClick, hideHeaderMenu }) => {
  const linkClassNames = useClassNames([
    'flex justify-between',
    categoriesNavigator?.length === 0 ? 'py-24' : link?.categoryId === 'myAccount' ? 'pb-16' : 'pb-36',
  ]);
  return (
    <div key={link.categoryId} className="cursor-pointer">
      {link?.descendants && link?.descendants?.length > 0 ? (
        <div onClick={onClick} className={linkClassNames}>
          <p className="text-primary">{link.name}</p>
          <ChevronRightIcon className="w-20 text-gray-600" />
        </div>
      ) : (
        <div onClick={hideHeaderMenu} className={linkClassNames}>
          <Link link={link?._url}>
            <p className="text-primary">{link.name}</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileMenuNavButton;
