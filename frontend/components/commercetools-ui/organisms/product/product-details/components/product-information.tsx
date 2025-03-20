import { FC, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { LineItem } from 'shared/types/wishlist/LineItem';
import { useTranslations } from 'use-intl';
import WishlistButton from 'components/commercetools-ui/organisms/wishlist/components/wishlist-button';
import { CurrencyHelpers } from 'helpers/currencyHelpers';
import useClassNames from 'helpers/hooks/useClassNames';
import usePath from 'helpers/hooks/usePath';
import { useRouter } from 'i18n/routing';
import { ProductDetailsProps } from '..';
import ProductVariant from './product-variant';

type ProductInformationProps = Omit<ProductDetailsProps, 'onAddToCart'>;

const ProductInformation: FC<ProductInformationProps> = ({
  product,
  variant,
  onChangeVariant,
  inModalVersion,
  wishlist,
  removeLineItem,
  addToWishlist,
}) => {
  const router = useRouter();

  const translate = useTranslations();

  const { locale } = useParams();

  const { path } = usePath();

  const attributesToDisplay = ['color', 'finish', 'size'];

  const discountPercentage =
    variant.discountedPrice &&
    ((variant.price?.centAmount as number) - (variant.discountedPrice?.value?.centAmount as number)) /
      (variant.price?.centAmount as number);

  const updateVariantSKU = (sku: string) => {
    router.replace(`/${path.split('/').filter(Boolean).slice(0, -1).join('/')}/${sku}`);
  };

  const productToWishlistLineItem = useMemo<LineItem>(() => {
    return {
      lineItemId: product?.productId ?? '',
      productId: product?.productId,
      productKey: product?.productKey,
      productRef: product?.productRef,
      name: product?.name,
      count: 1,
      variant: variant,
      addedAt: new Date(),
      _url: product?._url,
    };
  }, [product, variant]);

  const titleClassName = useClassNames(['break-normal mb-12', { '2xl:text-18': !inModalVersion }]);
  const priceClassName = useClassNames([
    'block leading-loose',
    { 'line-through text-gray-500': !!discountPercentage },
    { '2xl:text-20': !inModalVersion },
    { 'text-14': !!inModalVersion && !discountPercentage },
    { 'text-12': !!inModalVersion && !!discountPercentage },
  ]);
  const discountedPriceClassName = useClassNames([
    'block font-regular leading-loose text-red-500',
    { '2xl:text-18': !inModalVersion },
  ]);

  return (
    <div>
      <div className="relative flex items-center justify-between pr-40">
        <h1 className={`${titleClassName} font-medium leading-loose`}>{product?.name}</h1>
        <WishlistButton
          lineItem={productToWishlistLineItem}
          data={wishlist}
          removeFromWishlist={removeLineItem}
          addToWishlist={addToWishlist}
        />
      </div>
      {discountPercentage ? (
        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-8">
            <p className={discountedPriceClassName}>
              {CurrencyHelpers.formatForCurrency(variant.discountedPrice?.value as number, locale)}
            </p>
            <p className={priceClassName}>{CurrencyHelpers.formatForCurrency(variant.price ?? 0, locale)}</p>
          </div>

          {
            <span className="mb-8 ml-8 mt-10 flex h-25 w-45 items-center justify-center bg-red-500 text-11 text-white">
              {translate('common.percentage', { value: discountPercentage })}
            </span>
          }
        </div>
      ) : (
        <p className={priceClassName}>{CurrencyHelpers.formatForCurrency(variant.price as number, locale)}</p>
      )}
      {attributesToDisplay.map((attribute) => {
        if (variant?.attributes?.[attribute]) {
          return (
            <ProductVariant
              key={attribute}
              className="mt-20 border-b border-b-neutral-400 pb-20 md:mt-24"
              variants={product?.variants}
              currentVariant={variant}
              attribute={attribute}
              inModalVersion={inModalVersion}
              onClick={inModalVersion ? onChangeVariant : updateVariantSKU}
            />
          );
        }
      })}
    </div>
  );
};

export default ProductInformation;
