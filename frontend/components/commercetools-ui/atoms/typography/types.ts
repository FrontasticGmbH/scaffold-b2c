import { HTMLAttributes, type JSX } from 'react';

type Translation = {
  file: string;
  id: string;
  defaultValue?: string;
};

export const tagTypesToUse = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label'] as const;
type ElementType = Pick<JSX.IntrinsicElements, (typeof tagTypesToUse)[number]>;

export const fontSizes = [10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 42, 46, 52, 58] as const;

export interface TypographyProps
  extends Omit<
    HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement | HTMLLabelElement>,
    'children'
  > {
  as?: keyof ElementType | 'fragment';
  children?: string | Record<string, string>;
  className?: HTMLElement['className'];
  translation?: Translation;
  asSkeleton?: boolean;
  htmlFor?: string;
}
