import React, { useRef, useState } from 'react';
import { Category } from 'shared/types/product/Category';
import HeaderNavigationButtonDesktop from 'components/commercetools-ui/organisms/header/header-navigation/header-navigation-desktop/header-navigation-button';
import { Tile } from 'components/commercetools-ui/organisms/header/types';
import useClassNames from 'helpers/hooks/useClassNames';
import useScrollDirection from 'helpers/hooks/useScrollDirection';
import MenuDropdown from './menu-dropdown';

export interface Props {
  links: Category[];
  tiles: Tile[];
}

const HeaderNavigationDesktop: React.FC<Props> = ({ links, tiles }) => {
  const [activeCategory, setActiveCategory] = useState<Category>();

  const tileContent = tiles.filter((tile) => tile.tileCategory === activeCategory?.name);

  const showSubMenu = (category?: Category) => {
    setActiveCategory(category);
  };
  const hideSubMenu = () => {
    setActiveCategory(undefined);
  };

  const showTimeout = useRef<NodeJS.Timeout | null>(null) as React.MutableRefObject<NodeJS.Timeout | null>;

  const clearShowTimeout = () => {
    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }
  };

  const handleMouseIn = (category: Category) => {
    clearShowTimeout();
    if (activeCategory) showSubMenu(category); //Already opened do not delay
    else showTimeout.current = setTimeout(() => showSubMenu(category), 500);
  };

  const handleMouseOut = () => {
    clearShowTimeout();
    hideSubMenu();
  };

  const scrollDirection = useScrollDirection(5, -1);
  const navigationClassNames = useClassNames([
    'hidden items-center xl:flex duration-150 transition-all pl-44 w-fit',
    scrollDirection === 'down' ? 'h-0 opacity-0 pointer-events-none' : 'h-52 opacity-1 pointer-events-auto',
  ]);

  return (
    <div>
      {links && (
        <div className={navigationClassNames} onMouseLeave={handleMouseOut}>
          <div className="flex w-fit justify-start">
            {links.map((link) => (
              <div key={link?.categoryId} onMouseEnter={() => handleMouseIn(link)}>
                <HeaderNavigationButtonDesktop
                  show={link.categoryId === activeCategory?.categoryId}
                  link={link}
                  updateSubMenu={hideSubMenu}
                />
              </div>
            ))}
          </div>
          <MenuDropdown
            show={!!activeCategory && activeCategory.subCategories && activeCategory.subCategories.length > 0}
            onClick={hideSubMenu}
            links={activeCategory?.subCategories ?? []}
            tileContent={tileContent[0]}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderNavigationDesktop;
