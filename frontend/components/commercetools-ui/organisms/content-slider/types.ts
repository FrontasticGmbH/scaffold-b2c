import { ImageProps } from 'components/commercetools-ui/atoms/image';
import { Reference } from 'types/reference';

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
