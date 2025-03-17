import React, { FC, useEffect, useState } from 'react';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { Tile } from 'components/commercetools-ui/organisms/header/types';
import useClassNames from 'helpers/hooks/useClassNames';
import useListKeyboardNavigation from 'helpers/hooks/useListKeyboardNavigation';
import { classnames } from 'helpers/utils/classnames';
import { useRouter } from 'i18n/routing';
import { Category } from 'types/entity/category';
import HeaderDropdownTile from './header-menu-tile';

export interface Props {
  show: boolean | undefined;
  links: Category[];
  tileContent?: Tile;
  onClick?: () => void;
}

const MenuDropdown: FC<Props> = ({ show, links, tileContent, onClick }) => {
  const router = useRouter();

  const wrapperClassNames = useClassNames([
    'transition absolute flex justify-between bottom-0 left-0 duration-300 ease-in-out min-h-[300px] w-[100%] translate-y-full',
    show ? 'opacity-1 z-20 delay-300' : 'opacity-0 z-[-999] pointer-events-none',
    'border-b-2 border-t-2 border-b-accent border-t-neutral-400 bg-white pl-52 pr-48 py-32',
  ]);

  const linksClassNames = useClassNames(['grid grid-cols-4 gap-x-116 gap-y-28', tileContent ? 'pr-116' : '']);

  /* Keyboard Navigation */
  const [length, setLength] = useState(0);
  const {
    ref: listRef,
    activeIndex,
    activeInlineIndex,
    resetIndices,
  } = useListKeyboardNavigation({
    allow: () => !!show,
    length,
    inlineLength: links?.length ?? 0,
    defaultActiveInlineIndex: 0,
    defaultActiveIndex: 0,
    onSelect: (index, inlineIndex) => {
      if (index !== -1 && inlineIndex !== -1) {
        if (index === 0) router.push(links[activeInlineIndex]?._url ?? '');
        else router.push(links[activeInlineIndex]?.descendants?.[index - 1]?._url ?? '');
      }
    },
  });
  useEffect(() => {
    setLength((links[activeInlineIndex]?.descendants?.length ?? 0) + 1); //+1 for counting in root link as well
  }, [activeInlineIndex, links]);
  useEffect(() => {
    resetIndices();
  }, [links, resetIndices]);

  return (
    <div className={wrapperClassNames}>
      <ul ref={listRef} className={linksClassNames}>
        {links?.map((link, index) => (
          <li key={link.categoryId}>
            {link.depth === 1 ? (
              <>
                <div className="w-min pb-8">
                  <Link
                    link={link?._url}
                    variant="menu-header"
                    className={classnames('whitespace-nowrap', {
                      underline: index === activeInlineIndex && activeIndex === 0,
                    })}
                  >
                    <Typography className="text-14">{link.name}</Typography>
                  </Link>
                </div>
                {link.descendants &&
                  link.descendants.map((field, descIndex) => (
                    <div key={field.categoryId} onClick={onClick} className="w-min pb-8">
                      <Link
                        link={field?._url}
                        variant="menu-item"
                        className={classnames('whitespace-nowrap', {
                          underline: index === activeInlineIndex && activeIndex === descIndex + 1,
                        })}
                      >
                        <Typography className="text-14">{field.name}</Typography>
                      </Link>
                    </div>
                  ))}
              </>
            ) : (
              <Link key={link.categoryId} link={link?._url} variant="menu-header">
                <Typography className="text-14">{link.name}</Typography>
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
