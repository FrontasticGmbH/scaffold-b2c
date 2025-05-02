import { classnames } from '../classnames';

export type VarianceToken = string | (string | null | undefined)[] | Variants;

export interface Variants {
  [key: string]: VarianceToken;
}

/**
 *
 * This is a simple function that works in a kind of a similar way to https://cva.style/docs
 *
 * Example:
 *
 * const va = cva({ primary: { sm: 'bg-primary text-sm' } });
 * const className = va('primary.sm'); # className is 'bg-primary text-sm'
 *
 * More examples can be found in the `cva.spec.ts`
 */
export const cva = (variants: Variants) => {
  return (key: string) => {
    const tokens = key.split('.');

    const resolved = tokens.reduce((acc, curr) => {
      return (acc as Variants)?.[curr as keyof Variants];
    }, variants as VarianceToken);

    if (Array.isArray(resolved)) return classnames(...resolved);
    return resolved;
  };
};
