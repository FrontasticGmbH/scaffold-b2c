import { FC, useEffect, useMemo, useState } from 'react';
import { Variant as VariantType } from 'shared/types/product';
import Typography from 'components/commercetools-ui/atoms/typography';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';
import { discardRepeatedValues } from '../helpers/discardRepeatedValues';
import { filterAttributeBasedVariants } from '../helpers/filterAttributeBasedVariants';

type ProductVariantProps = {
  className?: string;
  currentVariant: VariantType;
  variants: VariantType[];
  attribute: string;
  inModalVersion?: boolean;
  onClick?: (sku: string) => void;
};

const ProductVariant: FC<ProductVariantProps> = ({
  className,
  currentVariant,
  variants,
  attribute,
  inModalVersion,
  onClick,
}) => {
  const { formatMessage } = useFormat({ name: 'product' });

  const [variantsToUse, setVariantsToUse] = useState<VariantType[]>();

  const attributeString = attribute.toString();

  const attributeToFilterTo = attribute == 'size' ? 'colorlabel' : 'size';

  useEffect(() => {
    const filteredVariants: VariantType[] = currentVariant.attributes?.['size']
      ? filterAttributeBasedVariants(variants, currentVariant, attributeToFilterTo)
      : discardRepeatedValues(variants, attribute.toString());
    setVariantsToUse(filteredVariants);
  }, [variants, attribute, currentVariant, attributeToFilterTo]);

  const hoverEffectClassName = useMemo(
    () => (variantsToUse && variantsToUse.length > 1 ? 'hover:cursor-pointer' : 'pointer-events-none'),
    [variantsToUse],
  );

  const getVariantClassName = (id: VariantType['id']) =>
    `${id == currentVariant.id ? 'border-2 border-neutral-500' : 'border-2 border-neutral-300'} ${
      attribute === 'size' ? sizeVariantClassname : defaultVariantClassName
    } `;

  const labelClassName = useClassNames([
    'capitalize leading-loose font-medium',
    inModalVersion ? 'text-12' : 'text-14',
  ]);
  const defaultVariantClassName = useClassNames(['h-20 w-20 rounded-full', hoverEffectClassName]);
  const sizeVariantClassname = useClassNames(['p-12', hoverEffectClassName]);
  const variantContainerClassName = useClassNames(['mt-16 flex', attribute == 'size' ? 'gap-12' : 'gap-24']);

  const sortVariantsCmp = (a: VariantType, b: VariantType) => {
    const first = a.attributes?.[attribute];
    const second = b.attributes?.[attribute];

    if (first > second) return 1;
    if (first < second) return -1;
    return 0;
  };

  return (
    <div className={className}>
      <div className={attribute == 'color' ? 'mt-4' : ''}>
        <Typography className={labelClassName}>
          {formatMessage({ id: attributeString, defaultMessage: attributeString })}
        </Typography>
        <Typography className="text-12 leading-loose">{currentVariant?.attributes?.[`${attribute}label`]}</Typography>
      </div>

      <div className={variantContainerClassName}>
        {variantsToUse?.sort(sortVariantsCmp).map(({ attributes, id, sku }) => (
          <div
            key={id}
            className={getVariantClassName(id)}
            style={attribute !== 'size' ? { backgroundColor: attributes?.[attribute] } : {}}
            onClick={() => onClick?.(sku)}
          >
            {attribute == 'size' && attributes?.[attribute]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductVariant;
