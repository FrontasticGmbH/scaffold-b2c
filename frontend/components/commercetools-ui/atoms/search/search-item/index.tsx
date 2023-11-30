import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from 'shared/types/product/Category';
import { Product } from 'shared/types/product/Product';
// import { Variant } from 'ct-types/product';
import { AUTOCOMPLETE_PRODUCT_CLICKED } from 'helpers/constants/events';
// import useVariantWithDiscount from 'helpers/hooks/useVariantWithDiscount';
import Image from 'frontastic/lib/image';
import Link from '../../link';
// import Prices from '../prices';

interface Props {
  hit: Product;
  categories: Category[];
  onClick?: () => void;
}

const SearchItem: React.FC<Props> = ({ hit, categories, onClick }) => {
  const router = useRouter();

  const primaryCategory = useMemo(
    () => categories.find((category) => category.categoryId === hit.categories?.[0]?.categoryId),
    [categories, hit],
  );

  const variant = useMemo(() => hit.variants?.[0], [hit]);
  // const discountedVariant = useVariantWithDiscount(hit.variants as Partial<Variant>[]);

  const handleClick = useCallback(() => {
    onClick?.();

    gtag('event', AUTOCOMPLETE_PRODUCT_CLICKED, hit);

    router.push(hit._url ?? '#');
  }, [hit, onClick, router]);

  return (
    <Link link={hit._url} onMouseUp={handleClick}>
      <div className="flex items-center gap-12">
        <div className="shrink-0 p-8">
          <div className="relative h-90 w-80">
            <Image src={variant?.images?.[0]} suffix="small" style={{ objectFit: 'contain' }} fill />
          </div>
        </div>
        <div>
          <p className="text-16 uppercase text-primary-black">{hit.name}</p>
          <div className="mt-5">
            <span className="text-14 text-secondary-black">{primaryCategory?.name}</span>
            {/* <Prices price={discountedVariant?.price ?? variant?.price} discountedPrice={discountedVariant?.price} /> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchItem;
