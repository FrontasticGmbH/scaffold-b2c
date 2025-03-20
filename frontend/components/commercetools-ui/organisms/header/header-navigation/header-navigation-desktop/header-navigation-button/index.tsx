import React, { FC, useEffect, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'components/commercetools-ui/atoms/link';
import useClassNames from 'helpers/hooks/useClassNames';
import { Category } from 'types/entity/category';

export interface Props {
  show: boolean;
  link: Category;
  updateSubMenu: () => void;
}

const HeaderNavigationButtonDesktop: FC<Props> = ({ show, link, updateSubMenu }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const navLinkClassNames = useClassNames([
    'flex border-primary py-4 cursor-pointer relative hover:border-b-2',
    show ? 'border-b-2' : '',
  ]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <></>;

  return (
    <div onClick={updateSubMenu} className="h-52 px-10 py-12">
      <Link link={link?._url} title={link?.name} className={navLinkClassNames}>
        <span>{link?.name}</span>
        {link?.descendants && link?.descendants.length > 0 && <ChevronDownIcon className="ml-10 w-16 text-gray-600" />}
      </Link>
    </div>
  );
};
export default HeaderNavigationButtonDesktop;
