import React, { FC } from 'react';
import { SwiperOptions } from 'swiper';
import Slider from 'components/commercetools-ui/atoms/slider';
import Subtitle, { SubtitleProps } from 'components/commercetools-ui/atoms/subtitle';
import Typography from 'components/commercetools-ui/atoms/typography';
import ProductTile from 'components/commercetools-ui/molecules/product-tile';
import Wrapper from 'components/HOC/wrapper';
import useClassNames from 'helpers/hooks/useClassNames';
import useTouchDevice from 'helpers/hooks/useTouchDevice';
import { mediumDesktop, tablet } from 'helpers/utils/screensizes';
import { ShippingMethod } from 'types/entity/cart';
import { Product, Variant } from 'types/entity/product';
import { LineItem, Wishlist } from 'types/entity/wishlist';
import { Reference } from 'types/reference';
import useTrack from './useTrack';
import Link from '../../content/link';

export interface ProductSliderProps extends Partial<SwiperOptions> {
  products: Product[];
  wishlist?: Wishlist;
  shippingMethods?: ShippingMethod[];
  title: string;
  titleVariant?: 'xs' | 'sm' | 'lg';
  subline?: string;
  subtitleVariant?: SubtitleProps['variant'];
  ctaLabel?: string;
  ctaLink?: Reference;
  clearDefaultWrapperStyles?: boolean;
  slidesPerView?: number;
  disableProductQuickView?: boolean;
  disableProductWishlistButton?: boolean;
  disableProductVariants?: boolean;
  innerArrows?: boolean;
  solidArrows?: boolean;
  onProductClick?: (product: Product) => void;
  classNames?: {
    title?: string;
  };
  variant?: 'normal' | 'cart';
  addToWishlist?: (lineItem: LineItem, count: number) => Promise<void>;
  removeLineItem?: (item: LineItem) => Promise<void>;
  onAddToCart?: (variant: Variant, quantity: number) => Promise<void>;
}

const ProductSlider: FC<ProductSliderProps> = ({
  products,
  wishlist,
  shippingMethods,
  title,
  subline,
  ctaLabel,
  ctaLink,
  titleVariant = 'lg',
  subtitleVariant = 'lg',
  clearDefaultWrapperStyles = false,
  disableProductQuickView = false,
  disableProductWishlistButton = false,
  disableProductVariants = false,
  innerArrows = true,
  solidArrows = true,
  breakpoints = {},
  classNames = {},
  addToWishlist,
  removeLineItem,
  onProductClick,
  onAddToCart,
  ...props
}) => {
  const { isTouchDevice } = useTouchDevice();

  const { trackClick } = useTrack();

  const titleClassName = useClassNames([
    'mb-12 text-20',
    classNames.title,
    {
      xs: 'md:text-16',
      sm: 'md:text-18 lg:text-22',
      lg: 'md:text-22 lg:text-28',
    }[titleVariant ?? 'lg'],
  ]);

  return (
    <Wrapper background="neutral-200" clearDefaultStyles={clearDefaultWrapperStyles}>
      <div>
        <Typography className={titleClassName} as="h3">
          {title}
        </Typography>
        {(subline || ctaLink) && (
          <div className="mt-8 flex items-center justify-between md:mt-16 lg:mt-14">
            {subline && <Subtitle subtitle={subline} variant={subtitleVariant} />}
            {ctaLink && (
              <div className="hidden lg:block">
                <Link target={ctaLink} withArrow>
                  <span className="font-medium leading-[24px] text-secondary-black">{ctaLabel}</span>
                </Link>
              </div>
            )}
          </div>
        )}
        {ctaLink && (
          <div className="mt-20 block md:mt-16 lg:hidden">
            <Link target={ctaLink} withArrow>
              <span className="font-medium leading-[24px] text-secondary-black">{ctaLabel}</span>
            </Link>
          </div>
        )}
      </div>
      <div className="pt-20 md:pt-24 lg:pt-20">
        <Slider
          slidesPerView={isTouchDevice ? 2.3 : 1.3}
          slidesPerGroup={1}
          dots={false}
          arrows
          innerArrows={innerArrows}
          solidArrows={solidArrows}
          nextButtonStyles={{ transform: 'translateY(-150%)' }}
          prevButtonStyles={{ transform: 'translateY(-150%)' }}
          allowTouchMove
          spaceBetween={8}
          breakpoints={{
            [tablet]: {
              slidesPerView: 2.3,
              spaceBetween: 25,
              ...(breakpoints[tablet] ?? {}),
            },
            [mediumDesktop]: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 25,
              ...(breakpoints[mediumDesktop] ?? {}),
            },
          }}
          {...props}
        >
          {products.map((product, index) => (
            <ProductTile
              key={product.productId}
              wishlist={wishlist}
              shippingMethods={shippingMethods}
              disableQuickView={disableProductQuickView}
              disableWishlistButton={disableProductWishlistButton}
              disableVariants={disableProductVariants}
              product={product}
              onClick={() => {
                trackClick(product, index + 1);
                onProductClick?.(product);
              }}
              addToWishlist={addToWishlist}
              removeLineItem={removeLineItem}
              onAddToCart={onAddToCart}
            />
          ))}
        </Slider>
      </div>
    </Wrapper>
  );
};

export default ProductSlider;
