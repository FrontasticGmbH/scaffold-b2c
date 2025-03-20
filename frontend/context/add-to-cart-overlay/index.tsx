import React, { useCallback, useContext, useState } from 'react';
import { useParams } from 'next/navigation';
import { Transition } from '@headlessui/react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'use-intl';
import Image from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';
import Overlay from 'components/commercetools-ui/atoms/overlay';
import ProductSlider from 'components/commercetools-ui/organisms/product/product-slider';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useScrollBlock from 'helpers/hooks/useScrollBlock';
import useTouchDevice from 'helpers/hooks/useTouchDevice';
import { mediumDesktop, tablet } from 'helpers/utils/screensizes';
import { Product, Variant } from 'types/entity/product';
import { useCart, useProduct, useWishlist } from 'frontastic';
import { AddToCartOverlayContextShape, StateProduct } from './types';

const AddToCartOverlayContext = React.createContext<AddToCartOverlayContextShape>({
  show() {},
  hide() {},
  fetchRelatedProducts() {
    return new Promise((res) => res());
  },
});

const AddToCartOverlayProvider = ({ children }: React.PropsWithChildren) => {
  const { locale } = useParams();

  const { data, addToWishlist, removeLineItem } = useWishlist();

  const { shippingMethods } = useCart();

  const { isTouchDevice } = useTouchDevice();

  const translate = useTranslations();

  const { blockScroll } = useScrollBlock();

  const { query } = useProduct();

  const [product, setProduct] = useState<StateProduct>();

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const fetchRelatedProducts = useCallback(
    async (product: Product) => {
      const category = product?.categories?.[0]?.categoryId;

      if (!category) return;

      const response = await query({ categories: [category], limit: 15 });

      if (response.isError) return;

      setRelatedProducts(response.data.items as Product[]);
    },
    [query],
  );

  const show = useCallback(
    (product: Product, variant: Variant, count: number) => {
      setProduct({ ...product, ...variant, count });
      blockScroll(true);
    },
    [blockScroll],
  );

  const hide = useCallback(() => {
    setProduct(undefined);
    blockScroll(false);
  }, [blockScroll]);

  return (
    <>
      {product && <Overlay onClick={hide} />}
      <Transition
        show={!!product}
        as="div"
        className="fixed bottom-0 z-[9999] w-full overflow-hidden rounded-[20px_20px_0_0] bg-white shadow md:bottom-[unset] md:left-1/2 md:top-1/2 md:w-[90%] md:max-w-[650px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-lg"
        enter="transition md:transition-opacity duration-75"
        enterFrom="opacity-0 translate-y-full"
        enterTo="opacity-100 translate-y-0"
        leave="transition md:transition-opacity duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-full"
      >
        <div onMouseUp={(e) => e.stopPropagation()}>
          <div className="bg-white p-16 md:px-48 md:py-24">
            <h4 className="text-18 leading-[27px] lg:text-22 lg:leading-[33px]">{translate('product.cart-added')}</h4>

            <CloseIcon
              className="absolute right-18 top-16 size-28 cursor-pointer fill-gray-600 stroke-0 md:top-16"
              onClick={hide}
              data-testid="close-icon"
            />

            <div className="mt-22 md:mt-35 lg:mt-30">
              <div className="flex items-center gap-24">
                <Link className="block shrink-0" link={product?._url}>
                  <Image
                    width={135}
                    height={150}
                    src={product?.images?.[0] ?? '#'}
                    style={{ objectFit: 'contain' }}
                    alt={product?.name ?? ''}
                    suffix={'small'}
                  />
                </Link>
                <div className="flex grow items-start justify-between overflow-hidden">
                  <div className="max-w-full overflow-hidden">
                    <Link className="block max-w-full truncate text-12 uppercase md:text-14" link={product?._url}>
                      {product?.name}
                    </Link>
                    <span className="mt-8 block text-12 font-medium md:hidden">
                      {CurrencyHelpers.formatForCurrency(
                        product?.discountedPrice?.value ?? product?.price ?? {},
                        locale,
                      )}
                    </span>
                    <span className="mt-12 block text-14 text-gray-600">x {product?.count}</span>
                  </div>
                  <span className="hidden text-14 font-medium md:block">
                    {CurrencyHelpers.formatForCurrency(product?.discountedPrice?.value ?? product?.price ?? {}, locale)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-18 flex w-full flex-col gap-16 md:mt-36 md:flex-row-reverse">
              <Link link="/cart" onClick={hide} className="md:flex-1">
                <button className="w-full rounded-sm bg-primary p-12 text-14 font-medium text-white">
                  {translate('cart.cart-go')}
                </button>
              </Link>
              <div onClick={hide} className="md:flex-1">
                <button className="w-full rounded-sm border border-primary p-12 text-14 font-medium text-primary transition hover:border-gray-600 hover:text-gray-600">
                  {translate('cart.continue-shopping')}
                </button>
              </div>
            </div>
          </div>
          <div className={`mt-36 hidden bg-neutral-200 py-24 md:block ${isTouchDevice ? 'px-48' : 'px-96'}`}>
            <ProductSlider
              clearDefaultWrapperStyles
              products={relatedProducts}
              wishlist={data}
              shippingMethods={shippingMethods.data}
              addToWishlist={async (lineItem, count) => {
                if (data) await addToWishlist(data, lineItem, count);
              }}
              removeLineItem={async (lineItem) => {
                if (data) await removeLineItem(data, lineItem);
              }}
              title={translate('product.bought-together')}
              titleVariant="xs"
              innerArrows={false}
              solidArrows={false}
              disableProductQuickView
              disableProductWishlistButton
              disableProductVariants
              onProductClick={hide}
              classNames={{ title: 'text-center' }}
              spaceBetween={10}
              slidesPerGroup={3}
              slidesPerView={3}
              breakpoints={{
                [tablet]: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                  spaceBetween: 10,
                },
                [mediumDesktop]: {
                  slidesPerView: 3,
                  slidesPerGroup: 3,
                  spaceBetween: 10,
                },
              }}
            />
          </div>
        </div>
      </Transition>
      <AddToCartOverlayContext.Provider value={{ show, hide, fetchRelatedProducts }}>
        {children}
      </AddToCartOverlayContext.Provider>
    </>
  );
};

export default AddToCartOverlayProvider;

export const useAddToCartOverlay = () => useContext(AddToCartOverlayContext);
