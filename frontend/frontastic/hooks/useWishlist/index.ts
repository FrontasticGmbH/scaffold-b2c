import { useCallback } from 'react';
import { LineItem } from 'shared/types/wishlist/LineItem';
import { Wishlist } from 'shared/types/wishlist/Wishlist';
import useSWR, { mutate, SWRResponse } from 'swr';
import { sdk } from 'sdk';
import { revalidateOptions } from 'frontastic';

const useWishlist = () => {
  const extensions = sdk.composableCommerce;

  const result = useSWR('/action/wishlist/getWishlist', extensions.wishlist.getWishlist, revalidateOptions);

  const data = (result.data?.isError ? {} : { data: result.data?.data }) as SWRResponse<Wishlist>;

  const totalWishlistItems = data.data?.lineItems?.reduce((acc, curr) => acc + (curr.count as number), 0) ?? 0;

  const addToWishlist = useCallback(async (wishlist: Wishlist, lineItem: LineItem, count = 1) => {
    const extensions = sdk.composableCommerce;

    const newWishlist = { ...wishlist, lineItems: [...(wishlist.lineItems ?? []), lineItem] };

    const res = extensions.wishlist.addItem({ variant: { sku: lineItem.variant?.sku as string }, count });

    await mutate('/action/wishlist/getWishlist', res, {
      optimisticData: { data: newWishlist },
      rollbackOnError: true,
    });
  }, []);

  const removeLineItem = useCallback(async (wishlist: Wishlist, lineItem: Partial<LineItem>) => {
    const extensions = sdk.composableCommerce;

    const newWishlist = {
      ...wishlist,
      lineItems: wishlist.lineItems?.filter((item) => item.lineItemId !== lineItem.lineItemId) ?? [],
    };

    const res = extensions.wishlist.removeItem({ lineItem: { id: lineItem.lineItemId as string } });
    await mutate('/action/wishlist/getWishlist', res, {
      optimisticData: { data: newWishlist },
      rollbackOnError: true,
    });
  }, []);

  const deleteWishlist = useCallback(async (wishlist: Wishlist) => {
    const res = await sdk.callAction({ actionName: 'wishlist/deleteWishlist' });
    const newWishlist = {
      ...wishlist,
      lineItems: [],
    };

    if (!res.isError) {
      await mutate('/action/wishlist/getWishlist', res.data, {
        optimisticData: { data: newWishlist },
        rollbackOnError: true,
      });
    }
  }, []);

  const updateLineItem = useCallback(async (wishlist: Wishlist, lineItem: LineItem, count = 1) => {
    const extensions = sdk.composableCommerce;

    const newWishlist = {
      ...wishlist,
      lineItems:
        wishlist.lineItems?.map((item) => {
          if (item.lineItemId === lineItem.lineItemId) {
            return { ...lineItem, count: ++count };
          }
        }) ?? [],
    };

    const res = await extensions.wishlist.updateItem({ lineItem: { id: lineItem.lineItemId }, count });

    if (!res.isError) {
      await mutate('/action/wishlist/getWishlist', res.data, {
        optimisticData: newWishlist,
        rollbackOnError: true,
      });
    }
  }, []);

  return {
    ...data,
    totalItems: totalWishlistItems,
    addToWishlist,
    removeLineItem,
    deleteWishlist,
    updateLineItem,
  };
};

export default useWishlist;
