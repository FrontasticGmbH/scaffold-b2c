'use client';

import React, { createContext, useCallback, useState } from 'react';
import AnnouncementBar, { Props as AnnouncementBarProps } from 'components/commercetools-ui/organisms/announcement-bar';
import Header from 'components/commercetools-ui/organisms/header';
import { HeaderProps, Market } from 'components/commercetools-ui/organisms/header/types';
import MaintenanceBar, { Props as MaintenanceBarProps } from 'components/commercetools-ui/organisms/maintenance-bar';
import { MarketProvider } from 'context/market';
import { useDebounce } from 'helpers/hooks/useDebounce';
import { LineItem as CartLineItem } from 'types/entity/cart';
import { LineItem as WishlistLineItem } from 'types/entity/wishlist';
import { useCart, useProduct, useWishlist } from 'frontastic/hooks';
import { TasticProps } from '../types';

const initialMarketState = {
  market: {} as Market,
  markets: [] as Market[],
  handleMarket: {} as (market: Market) => void,
};
export const MarketContext = createContext(initialMarketState);

const HeaderTastic = ({ data, categories }: TasticProps<HeaderProps & AnnouncementBarProps & MaintenanceBarProps>) => {
  const [query, setQuery] = useState('');

  const debounecdQuery = useDebounce(query, 150);

  const { products } = useProduct({ query: debounecdQuery, limit: 6 });

  const {
    data: cart,
    isEmpty,
    totalItems: totalCartItems,
    addItem,
    removeItem,
    updateItem,
    redeemDiscountCode,
    removeDiscountCode,
  } = useCart();

  const {
    data: wishlist,
    addToWishlist,
    totalItems: totalWishlistItems,
    removeLineItem,
    deleteWishlist,
  } = useWishlist();

  const moveToWishlist = useCallback(
    async (lineItem: CartLineItem) => {
      if (!wishlist) return;

      await Promise.all([
        await removeItem(lineItem.lineItemId as string),
        addToWishlist(
          wishlist,
          {
            lineItemId: lineItem.lineItemId ?? '',
            productId: lineItem.productId,
            name: lineItem.name,
            type: lineItem.type,
            count: 1,
            variant: lineItem.variant,
            addedAt: new Date(),
            _url: lineItem._url,
          },
          1,
        ),
      ]);
    },
    [removeItem, addToWishlist, wishlist],
  );

  const announcementBarData = {
    text: data.text,
    highlightedSubstring: data.highlightedSubstring,
    target: data.target,
  };

  const maintenanceData = {
    activateMaintenance: data.activateMaintenance,
    maintenanceText: data.maintenanceText,
  };

  return (
    <MarketProvider>
      <div className="pt-148 md:pt-180 lg:pt-183 xl:pt-173" />
      <div id="header-container" className="fixed top-0 z-50 w-full">
        <AnnouncementBar {...announcementBarData} />
        {maintenanceData.activateMaintenance && <MaintenanceBar {...maintenanceData} />}
        <Header
          cart={cart}
          isEmpty={isEmpty}
          onApplyDiscountCode={redeemDiscountCode}
          onRemoveDiscountCode={removeDiscountCode}
          onRemoveItem={removeItem}
          onUpdateItem={updateItem}
          OnMoveToWishlist={moveToWishlist}
          wishlist={wishlist}
          onRemoveFromWishlist={async (lineItemId) => {
            if (wishlist) {
              await removeLineItem(
                wishlist,
                wishlist.lineItems?.find((item) => item.lineItemId === lineItemId) as WishlistLineItem,
              );
            }
          }}
          onMoveToCart={async (lineItem: WishlistLineItem) => {
            if (wishlist && lineItem.variant) {
              await removeLineItem(
                wishlist,
                wishlist.lineItems?.find((item) => item.lineItemId === lineItem.lineItemId) as WishlistLineItem,
              );

              await addItem(lineItem.variant, 1);
            }
          }}
          onClearWishlist={async () => {
            if (wishlist) deleteWishlist(wishlist);
          }}
          totalCartItems={totalCartItems}
          totalWishlistItems={totalWishlistItems}
          navLinks={categories?.filter((category) => category.depth === 0)}
          categories={categories}
          logo={data.logo}
          logoLink={data.logoLink}
          logoMobile={data.logoMobile}
          logoLinkMobile={data.logoLinkMobile}
          tiles={data.tiles}
          searchItems={products}
          onSearchQueryUpdate={(q) => setQuery(q)}
          emptyCartTitle={data.emptyCartTitle}
          emptyCartSubtitle={data.emptyCartSubtitle}
          emptyCartImage={data.emptyCartImage}
          emptyCartCategories={data.emptyCartCategories}
          emptyWishlistTitle={data.emptyWishlistTitle}
          emptyWishlistSubtitle={data.emptyWishlistSubtitle}
          emptyWishlistImage={data.emptyWishlistImage}
          emptyWishlistCategories={data.emptyWishlistCategories}
          enableAlgoliaSearch={data.enableAlgoliaSearch}
        />
      </div>
    </MarketProvider>
  );
};
export default HeaderTastic;
