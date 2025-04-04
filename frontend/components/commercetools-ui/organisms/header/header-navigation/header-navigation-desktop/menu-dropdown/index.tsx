import React, { FC, useEffect, useRef } from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import { Tile } from 'components/commercetools-ui/organisms/header/types';
import useClassNames from 'helpers/hooks/useClassNames';
import { Category } from 'types/entity/category';
import HeaderDropdownTile from './header-menu-tile';

export interface Props {
  show: boolean | undefined;
  links: Category[];
  tileContent?: Tile;
  onClick?: () => void;
}

const MenuDropdown: FC<Props> = ({ show, links, tileContent, onClick }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const wrapperClassNames = useClassNames([
    'transition absolute flex justify-between bottom-0 left-0 duration-300 ease-in-out min-h-[300px] w-[100%] translate-y-full',
    show ? 'opacity-1 z-20 delay-300' : 'opacity-0 z-[-999] pointer-events-none',
    'border-b-2 border-t-2 border-b-accent border-t-neutral-400 bg-white pl-52 pr-48 py-32',
  ]);

  const linksClassNames = useClassNames(['grid grid-cols-4 gap-x-116 gap-y-28', tileContent ? 'pr-116' : '']);
  useEffect(() => {
    if (show && links?.length) {
      ref.current?.focus();
    }
  }, [show, links]);
  return (
    <div className={wrapperClassNames}>
      <ul className={linksClassNames}>
        {links?.map((link, index) => (
          <li key={link.categoryId}>
            {link.depth === 1 ? (
              <>
                <div className="w-min pb-8">
                  <Link
                    link={link?._url}
                    ref={index === 0 ? ref : null}
                    variant="menu-header"
                    className="whitespace-nowrap"
                  >
                    <p className="text-14">{link.name}</p>
                  </Link>
                </div>
                {link.descendants?.map((field) => (
                  <div key={field.categoryId} className="w-min pb-8">
                    <Link link={field?._url} onClick={onClick} variant="menu-item" className="whitespace-nowrap">
                      <p className="text-14">{field.name}</p>
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              <Link key={link.categoryId} link={link?._url} variant="menu-header">
                <p className="text-14">{link.name}</p>
              </Link>
            )}
          </li>
        ))}
      </ul>
      {tileContent && <HeaderDropdownTile tileContent={tileContent} />}
    </div>
  );
};

export default MenuDropdown;
