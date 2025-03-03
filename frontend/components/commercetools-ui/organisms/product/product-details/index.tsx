import React, { FC, useEffect, useState } from 'react';
import Button from 'components/commercetools-ui/atoms/button';
import Link from 'components/commercetools-ui/atoms/link';
import QuantitySelector from 'components/commercetools-ui/atoms/quantity-selector';
import Typography from 'components/commercetools-ui/atoms/typography';
import Breadcrumb from 'components/commercetools-ui/molecules/breadcrumb';
import Gallery from 'components/commercetools-ui/organisms/gallery';
import { useAddToCartOverlay } from 'context/add-to-cart-overlay';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import { ShippingMethod } from 'types/entity/cart';
import { Category } from 'types/entity/category';
import { Variant } from 'types/entity/product';
import { LineItem, Wishlist } from 'types/entity/wishlist';
import AdditionalInfo from './components/additional-info';
import ProductInformation from './components/product-information';
import ShippingSection from './components/shipping-section';
import useTrack from './hooks/useTrack';
import { UIProduct } from './types';

export interface ProductDetailsProps {
  product: UIProduct;
  variant: Variant;
  url?: string;
  category?: Category;
  wishlist?: Wishlist;
  shippingMethods?: ShippingMethod[];
  inModalVersion?: boolean;
  onChangeVariant: (sku: string) => void;
  setIsOpen?: (value: boolean) => void;
  removeLineItem?: (item: LineItem) => Promise<void>;
  addToWishlist?: (lineItem: LineItem, count: number) => Promise<void>;
  onAddToCart?: (variant: Variant, quantity: number) => Promise<void>;
  inCartQuantity?: number;
}

const ProductDetails: FC<ProductDetailsProps> = ({
  product,
  variant,
  category,
  url,
  wishlist,
  shippingMethods,
  inModalVersion,
  onChangeVariant,
  setIsOpen,
  removeLineItem,
  addToWishlist,
  onAddToCart,
  inCartQuantity = 0,
}) => {
  const { formatMessage } = useFormat({ name: 'cart' });
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const [quantity, setQuantity] = useState<number>(variant.isOnStock ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const { trackAddToCart } = useTrack({ product, inModalVersion });

  const { show, fetchRelatedProducts } = useAddToCartOverlay();

  const handleAddToCart = async () => {
    setLoading(true);

    onAddToCart?.(variant, quantity).then(() => {
      setLoading(false);

      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        setQuantity(inCartQuantity + quantity >= (variant.availableQuantity ?? 0) ? 0 : 1);
      }, 1000);

      show({ ...product, _url: url }, variant, quantity);
    });
    trackAddToCart();
  };

  useEffect(() => {
    fetchRelatedProducts(product);
  }, [product, fetchRelatedProducts]);

  const wrapperClassName = inModalVersion
    ? 'md:grid grid-cols-12 pt-70 pb-35 px-20 md:pr-36'
    : 'pt-20 md:pt-24 pb-32 md:grid md:grid-cols-12 md:items-start lg:px-48 md:px-24 px-16';

  const galleryContainerClassName = useClassNames([
    inModalVersion ? 'col-span-6' : 'md:col-span-7 lg:col-span-8',
    'md:pr-26 lg:pr-60',
  ]);

  const informationContainerClassName = useClassNames([
    inModalVersion ? 'col-span-6' : 'md:col-span-5 lg:col-span-4',
    'mt-24 md:mt-0',
  ]);

  return (
    <div className={wrapperClassName}>
      {category && !inModalVersion && (
        <Breadcrumb Separator="/" className="col-span-12 mb-24 hidden w-fit lg:block">
          <Link key={category.categoryId} link={category._url} className="text-14 text-gray-700">
            {category.name}
          </Link>

          <Typography key={product.slug} className="cursor-default text-14 text-gray-500">
            {product.name}
          </Typography>
        </Breadcrumb>
      )}

      <div className={galleryContainerClassName}>
        <Gallery images={variant.images ?? []} inModalVersion={inModalVersion} />
      </div>

      <div className={informationContainerClassName}>
        <ProductInformation
          product={product}
          variant={variant}
          category={category}
          onChangeVariant={onChangeVariant}
          inModalVersion={inModalVersion}
          wishlist={wishlist}
          removeLineItem={removeLineItem}
          addToWishlist={addToWishlist}
        />

        {!variant.isOnStock && (
          <div className="pt-20">
            <p className="font-medium text-red-500">
              {formatProductMessage({ id: 'outOfStock', defaultMessage: 'Out of stock' })}
            </p>
          </div>
        )}

        <div className="flex gap-8 pt-20">
          <QuantitySelector
            value={quantity}
            minValue={inCartQuantity >= (variant.availableQuantity ?? 0) ? 0 : Number(variant.isOnStock)}
            maxValue={(variant.availableQuantity ?? Infinity) - inCartQuantity}
            disabled={!variant.isOnStock}
            onChange={setQuantity}
          />
          <Button
            className="w-full rounded-sm text-14 font-medium"
            variant="primary"
            onClick={handleAddToCart}
            loading={loading}
            added={added}
            disabled={!variant.isOnStock}
          >
            {variant.isOnStock
              ? formatMessage({ id: 'cart.add', defaultMessage: 'Add to cart' })
              : formatProductMessage({ id: 'currently.unavailable', defaultMessage: 'Currently unavailable' })}
          </Button>
        </div>

        {!inModalVersion && <ShippingSection shippingMethods={shippingMethods} />}

        {inModalVersion && (
          <Link
            link={url}
            className="mx-auto mt-28 block w-fit border-b border-transparent text-center text-14 leading-loose text-gray-600 hover:border-gray-600"
            onClick={() => setIsOpen?.(false)}
          >
            {formatMessage({ id: 'more.details', defaultMessage: 'More details' })}
          </Link>
        )}
      </div>

      {!inModalVersion && (
        <div className="grid gap-y-34 md:col-span-7 md:mb-50 md:pr-20 lg:col-span-8 lg:pr-52">
          <AdditionalInfo productspec={variant?.attributes?.productspec} description={product?.description ?? ''} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
