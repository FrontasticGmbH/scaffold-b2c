import React from 'react';
import dynamic from 'next/dynamic';
import HeaderLogo from 'components/commercetools-ui/organisms/header/header-logo';
import HeaderNavigationDesktop from 'components/commercetools-ui/organisms/header/header-navigation/header-navigation-desktop';
import HeaderNavigationMobile from 'components/commercetools-ui/organisms/header/header-navigation/header-navigation-mobile';
import { HeaderProps } from 'components/commercetools-ui/organisms/header/types';
import UtilitySection from 'components/commercetools-ui/organisms/header/utility-section';

const AlgoliaSearch = dynamic(() => import('components/commercetools-ui/atoms/search-algolia'));
const CommercetoolsSearch = dynamic(() => import('components/commercetools-ui/atoms/search'));

const Header: React.FC<HeaderProps> = ({
  cart,
  isEmpty,
  onRemoveDiscountCode,
  onApplyDiscountCode,
  totalCartItems,
  totalWishlistItems,
  onRemoveItem,
  onUpdateItem,
  OnMoveToWishlist,
  wishlist,
  onMoveToCart,
  onRemoveFromWishlist,
  onClearWishlist,
  navLinks,
  categories,
  logo,
  logoMobile,
  logoLink,
  logoLinkMobile,
  tiles,
  searchItems,
  onSearchQueryUpdate,
  emptyCartTitle,
  emptyCartSubtitle,
  emptyCartImage,
  emptyCartCategories,
  emptyWishlistTitle,
  emptyWishlistSubtitle,
  emptyWishlistImage,
  emptyWishlistCategories,
  enableAlgoliaSearch = false,
}) => {
  const Search = enableAlgoliaSearch ? AlgoliaSearch : CommercetoolsSearch;

  return (
    <header className="relative h-fit w-full border-b-[1.5px] border-neutral-400 bg-white">
      <div aria-label="Top" className="flex w-full items-center justify-between px-16 md:px-24 lg:px-20 xl:px-48">
        <HeaderNavigationMobile logo={logoMobile} links={navLinks} logoLink={logoLinkMobile} />

        <div className="ml-0 flex w-full justify-start lg:ml-20 xl:ml-0 xl:w-fit">
          <HeaderLogo
            logo={logo}
            logoLink={logoLink}
            imageClassName="flex h-44 w-188 justify-center text-center text-16 font-bold md:h-76 md:w-214 md:text-28"
          />
        </div>

        <div className="relative hidden w-full px-16 py-12 md:px-32 lg:px-20 xl:block xl:px-60">
          <Search categories={categories} items={searchItems} onQueryUpdate={onSearchQueryUpdate} />
        </div>

        <UtilitySection
          cart={cart}
          onRemoveDiscountCode={onRemoveDiscountCode}
          onApplyDiscountCode={onApplyDiscountCode}
          isEmpty={isEmpty}
          onRemoveItem={onRemoveItem}
          onUpdateItem={onUpdateItem}
          OnMoveToWishlist={OnMoveToWishlist}
          wishlist={wishlist}
          onRemoveFromWishlist={onRemoveFromWishlist}
          onMoveToCart={onMoveToCart}
          onClearWishlist={onClearWishlist}
          totalCartItems={totalCartItems}
          totalWishlistItems={totalWishlistItems}
          emptyCartTitle={emptyCartTitle}
          emptyCartSubtitle={emptyCartSubtitle}
          emptyCartImage={emptyCartImage}
          emptyCartCategories={emptyCartCategories}
          emptyWishlistTitle={emptyWishlistTitle}
          emptyWishlistSubtitle={emptyWishlistSubtitle}
          emptyWishlistImage={emptyWishlistImage}
          emptyWishlistCategories={emptyWishlistCategories}
        />
      </div>

      <div className="relative block w-full border-t border-neutral-400 px-16 py-8 md:px-24 lg:px-20 xl:hidden xl:px-48">
        <Search categories={categories} items={searchItems} onQueryUpdate={onSearchQueryUpdate} />
      </div>

      <HeaderNavigationDesktop links={navLinks} tiles={tiles ?? []} />
    </header>
  );
};
export default Header;
