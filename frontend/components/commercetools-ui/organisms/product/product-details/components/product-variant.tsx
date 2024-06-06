import { FC, useCallback, useMemo } from 'react';
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

  const attributeString = attribute.toString();

  const attributeToFilterTo = attribute == 'size' ? 'colorlabel' : 'size';

  const sortVariantsCmp = useCallback(
    (a: VariantType, b: VariantType) => {
      const first = a.attributes?.[attribute];
      const second = b.attributes?.[attribute];

      if (first > second) return 1;
      if (first < second) return -1;
      return 0;
    },
    [attribute],
  );

  const variantsToUse: VariantType[] = useMemo(() => {
    const result = currentVariant.attributes?.['size']
      ? filterAttributeBasedVariants(variants, currentVariant, attributeToFilterTo)
      : discardRepeatedValues(variants, attribute.toString());

    result.sort(sortVariantsCmp);

    return result;
  }, [attribute, attributeToFilterTo, currentVariant, variants, sortVariantsCmp]);

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
  const sizeVariantClassname = useClassNames(['text-14 p-12', hoverEffectClassName]);
  const variantContainerClassName = useClassNames(['mt-16 flex', attribute == 'size' ? 'gap-12' : 'gap-24']);

  return (
    <div className={className}>
      <div className={attribute == 'color' ? 'mt-4 grid gap-4' : ''}>
        <Typography className={labelClassName}>
          {formatMessage({ id: attributeString, defaultMessage: attributeString })}
        </Typography>
        <Typography className="text-14 leading-loose">{currentVariant?.attributes?.[`${attribute}label`]}</Typography>
      </div>

      <div className={variantContainerClassName}>
        {(variantsToUse ?? []).map(({ attributes, id, sku }) => (
          <Typography
            key={id}
            onClick={() => onClick?.(sku)}
            className={getVariantClassName(id)}
            style={attribute !== 'size' ? { backgroundColor: attributes?.[attribute] } : {}}
          >
            {attribute == 'size' && attributes?.[attribute]}
          </Typography>
        ))}
      </div>
    </div>
  );
};

export default ProductVariant;
