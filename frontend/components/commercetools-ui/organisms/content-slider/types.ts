import { Reference } from 'types/reference';
import { ImageProps } from 'frontastic/lib/image';

export type ContentSliderSlideProps = {
  image: ImageProps;
  title: string;
  ctaLabel?: string;
  summary?: string;
  ctaReference?: Reference;
};

export type ContentSliderProps = {
  title?: string;
  subtitle?: string;
  slides: ContentSliderSlideProps[];
};
