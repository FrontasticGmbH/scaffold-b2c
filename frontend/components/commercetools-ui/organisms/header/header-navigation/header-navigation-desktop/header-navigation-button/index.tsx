import React, { FC, useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'components/commercetools-ui/atoms/link';
import useClassNames from 'helpers/hooks/useClassNames';
import { Category } from 'types/entity/category';
import { classnames } from 'helpers/utils/classnames';
import { usePathname } from 'i18n/routing';

export interface Props {
  show: boolean;
  link: Category;
  updateSubMenu: () => void;
}

const HeaderNavigationButtonDesktop: FC<Props> = ({ show, link, updateSubMenu }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const pathname = usePathname();
  const pathnameWithoutQuery = pathname.split('?')[0];

  const isActive = `${link._url}/` === pathnameWithoutQuery;

  const navLinkClassNames = useClassNames([
    'flex py-4 cursor-pointer relative hover:[&>nth-child(1)]:border-primary hover:[&>nth-child(1)]:font-semibold',
  ]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <></>;

  return (
    <div onClick={updateSubMenu} className="h-52 px-10 py-12">
      <Link link={link?._url} title={link?.name} className={navLinkClassNames}>
        <span
          className={classnames(
            'block border-b-2',
            show || isActive ? 'border-primary font-semibold' : 'border-transparent',
          )}
        >
          {link?.name}
        </span>
        {link?.descendants && link?.descendants.length > 0 && <ChevronDownIcon className="ml-10 w-16 text-gray-600" />}
      </Link>
    </div>
  );
};
export default HeaderNavigationButtonDesktop;
