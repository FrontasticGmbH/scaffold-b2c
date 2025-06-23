import { FC, useCallback, useMemo } from 'react';
import { Variant as VariantType } from 'shared/types/product';
import { useTranslations } from 'use-intl';
import useClassNames from 'helpers/hooks/useClassNames';
import { textToColor } from '../../../../../../helpers/textToColor/textToColor';
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
  const translate = useTranslations();

  const attributeString = attribute.toString();

  const attributeToFilterTo = attribute == 'size' ? 'color' : 'size';

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
    () => (variantsToUse && variantsToUse.length > 1 ? 'cursor-pointer' : 'cursor-default'),
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

  const getButtonDescriptiveTitle = useCallback(
    (attributes: Record<string, string>) => {
      switch (attribute) {
        case 'color':
          return translate('product.switch-to-color', { color: attributes[attribute].split(':')[0] });
        case 'finish':
          return translate('product.switch-to-finish', { color: attributes[attribute].split(':')[0] });
        case 'size':
          return translate('product.switch-to-size', { size: attributes[attribute] });
        default:
          return translate('product.switch-to', {
            term: (attributes[attribute] as unknown as { label: string }).label ?? attributes[attribute],
          });
      }
    },
    [attribute, translate],
  );
  return (
    <div className={className}>
      <div className={attribute == 'color' ? 'mt-4 grid gap-4' : ''}>
        <h3 className={labelClassName}>
          {
            // @ts-ignore
            translate(`product.${attributeString}`)
          }
        </h3>
        <p className="text-14 leading-loose">
          {currentVariant?.attributes?.[`${attribute}label`] ??
            textToColor(currentVariant?.attributes?.[attribute]).label}
        </p>
      </div>

      <div className={variantContainerClassName}>
        {(variantsToUse ?? []).map(({ attributes, id, sku }) => {
          const attributeCodeLabel = attribute.split('-').length === 2 ? `${attribute.split('-')[0]}-code` : '';

          const backgroundColor = attributeCodeLabel
            ? attributes?.[attributeCodeLabel]
            : textToColor(attributes?.[attribute]).code;

          return (
            <button
              key={id}
              title={getButtonDescriptiveTitle(attributes as Record<string, string>)}
              onClick={() => onClick?.(sku)}
              className={getVariantClassName(id)}
              style={attribute !== 'size' ? { backgroundColor } : {}}
            >
              {attribute == 'size' && attributes?.[attribute]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariant;
