import React, { FC, useMemo, useState } from 'react';
import Image from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';
import OutOfStock from 'components/commercetools-ui/atoms/out-of-stock';
import QuickView from 'components/commercetools-ui/organisms/product/product-quick-view';
import WishlistButton from 'components/commercetools-ui/organisms/wishlist/components/wishlist-button';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import useVariantWithDiscount from 'helpers/hooks/useVariantWithDiscount';
import { textToColor } from 'helpers/textToColor/textToColor';
import { desktop } from 'helpers/utils/screensizes';
import { Cart, ShippingMethod } from 'types/entity/cart';
import { Product, Variant } from 'types/entity/product';
import { LineItem, Wishlist } from 'types/entity/wishlist';
import Prices from './prices';
import useTrack from './useTrack';

export interface ProductTileProps {
  product: Product;
  isSearchResult?: boolean;
  disableQuickView?: boolean;
  disableWishlistButton?: boolean;
  disableVariants?: boolean;
  selectedVariantIndex?: number;
  wishlist?: Wishlist;
  cart?: Cart;
  shippingMethods?: ShippingMethod[];
  onClick?: () => void;
  removeLineItem?: (item: LineItem) => Promise<void>;
  addToWishlist?: (lineItem: LineItem, count: number) => Promise<void>;
  onAddToCart?: (variant: Variant, quantity: number) => Promise<void>;
}

const ProductTile: FC<ProductTileProps> = ({
  product,
  isSearchResult = false,
  disableQuickView = false,
  disableWishlistButton = false,
  disableVariants = false,
  selectedVariantIndex = 0,
  wishlist,
  cart,
  shippingMethods,
  onClick,
  addToWishlist,
  removeLineItem,
  onAddToCart,
}) => {
  const [isDesktopSize] = useMediaQuery(desktop);

  const { ref } = useTrack({ product });

  const variantWithDiscount = useVariantWithDiscount(product.variants) as Variant;

  const [userSelectedVariant, setUserSelectedVariant] = useState<Variant | undefined>(undefined);

  const selectedVariant = userSelectedVariant ?? variantWithDiscount ?? product?.variants[selectedVariantIndex];

  const hasDiscount =
    selectedVariant.discountedPrice?.value?.centAmount &&
    selectedVariant.price?.centAmount &&
    selectedVariant.discountedPrice?.value?.centAmount < selectedVariant.price.centAmount;

  const discountedPrice = selectedVariant?.discountedPrice;

  const discountPercentage = selectedVariant
    ? (((selectedVariant.price?.centAmount as number) - (discountedPrice?.value?.centAmount as number)) /
        (selectedVariant.price?.centAmount as number)) *
      100
    : 0;

  const [imageHovered, setImageHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const buttonIsVisible = useMemo(
    () => (imageHovered || buttonHovered) && isDesktopSize,
    [imageHovered, buttonHovered, isDesktopSize],
  );

  const hideButton = () => {
    setImageHovered(false);
    setButtonHovered(false);
  };

  const productToWishlistLineItem = useMemo<LineItem | undefined>(() => {
    if (product) {
      return {
        lineItemId: product.productId ?? '',
        productId: product.productId,
        productKey: product.productKey,
        productRef: product.productRef,
        name: product.name,
        count: 1,
        variant: selectedVariant,
        addedAt: new Date(),
        _url: product._url,
      };
    }
  }, [product, selectedVariant]);

  const productUrl = useMemo(() => {
    if (!product._url) return `/${(product.name ?? '').toLowerCase().replace(/\s+/g, '-')}/p/${selectedVariant.sku}`;

    const name = product._url.split('/')[1];

    return `/${name}/p/${selectedVariant.sku}` + (isSearchResult ? '?sr=1' : '');
  }, [product, selectedVariant, isSearchResult]);

  return (
    <div onClick={onClick} ref={ref} data-testid="product-tile">
      <div className="relative">
        <Link link={productUrl}>
          <div
            className="relative w-full"
            data-testid="image-container"
            onMouseEnter={() => setImageHovered(true)}
            onMouseLeave={() => setImageHovered(false)}
          >
            <div className="relative bg-white p-8 md:p-16">
              <div className="relative block w-full" style={{ paddingBottom: '122%' }}>
                <Image
                  src={selectedVariant.images?.[0]}
                  suffix="medium"
                  alt={product.name ?? ''}
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  className="w-full rounded-sm group-hover:opacity-75 md:p-16"
                  fill
                />
              </div>
            </div>
            <span
              className="absolute right-0 top-0 z-10 flex size-32 cursor-pointer items-center justify-center md:size-48"
              onClick={(e) => e.preventDefault()}
              data-testid="wishlist-button"
            >
              {!disableWishlistButton && productToWishlistLineItem && (
                <WishlistButton
                  data={wishlist}
                  lineItem={productToWishlistLineItem}
                  className="size-12 md:size-20 lg:size-32"
                  addToWishlist={addToWishlist}
                  removeFromWishlist={removeLineItem}
                />
              )}
            </span>
          </div>
        </Link>

        <div
          className="absolute bottom-0 z-10 w-full"
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
        >
          {hasDiscount && (
            <div className="w-full text-center">
              <span className="mb-8 ml-8 flex h-25 w-45 items-center justify-center bg-red-500 text-12 text-white">
                {Math.round(discountPercentage)}%
              </span>
            </div>
          )}
          {!selectedVariant.isOnStock && (
            <div className="w-full text-center">
              <div className="mb-8 ml-8">
                <OutOfStock />
              </div>
            </div>
          )}
          <QuickView
            buttonIsVisible={buttonIsVisible && !disableQuickView}
            product={product}
            wishlist={wishlist}
            cart={cart}
            shippingMethods={shippingMethods}
            hideButton={hideButton}
            addToWishlist={addToWishlist}
            removeFromWishlist={removeLineItem}
            onAddToCart={async (variant, quantity: number) => {
              await onAddToCart?.(variant, quantity);
            }}
          />
        </div>
      </div>

      <Link link={productUrl}>
        <div>
          <div className="mt-4 block max-w-[80%] overflow-hidden text-ellipsis whitespace-pre text-12 uppercase leading-loose md:mt-12 md:text-14">
            {product?.name}
          </div>
          {!disableVariants && (
            <div className="mt-8 flex items-center gap-4 md:mt-12">
              {product?.variants
                .filter(
                  (variant, index, arr) =>
                    arr.findIndex(
                      (v) => textToColor(v.attributes?.color).code === textToColor(variant.attributes?.color).code,
                    ) === index,
                )
                .map((variant, index) => (
                  <span
                    key={index}
                    data-testid="product-variant"
                    className={`block cursor-pointer rounded-full border p-6 ${
                      variant.sku !== selectedVariant.sku ? 'border-neutral-300' : 'border-neutral-500'
                    }`}
                    style={{
                      backgroundColor:
                        textToColor(variant.attributes?.color).code || textToColor(variant.attributes?.finish).code,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setUserSelectedVariant(variant);
                    }}
                  ></span>
                ))}
            </div>
          )}
          <div className="mt-8 md:mt-12">
            <Prices price={selectedVariant?.price} discountedPrice={discountedPrice} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductTile;
