import { Product, Variant } from 'shared/types/product';
import { Money } from 'shared/types/product/Money';

export type UIProduct = Product & {
  name: string;
  variants: Variant[];
  price: Money;
  images: UIImage[];
  colors: UIColor[];
  sizes: UISize[];
  description: string;
  details: UIDetail[];
};

interface UIImage {
  id: string;
  src: string;
  alt: string;
}

export interface UIColor {
  name: string;
  key: string;
  bgColor: string;
  selectedColor: string;
}

export interface UISize {
  label: string;
  key: string;
}

interface UIDetail {
  name: string;
  items: string[];
}
