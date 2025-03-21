import { ImageProps as NextImageProps } from 'next/image';

export interface Gravity {
  mode?: string;
  coordinates?: { x: number; y: number };
}

export interface FrontasticImage {
  src?: string;
  width?: number;
  height?: number;
  suffix?: string;
  media?: {
    mediaId?: string;
    file?: string;
    filename?: string;
    description?: string;
    alt?: string;
    created?: string;
    updateDate?: string | null;
    format?: string;
    name?: string;
    width?: number | string;
    height?: number | string;
    metaData?: string | string[];
    resourceType?: string;
    size?: number;
    tags?: string[];
    _type?: string;
  };
  ratio?: string;
  gravity?: Gravity;
}

export type ImageProps = Omit<NextImageProps, 'src' | 'alt' | 'key'> &
  Omit<FrontasticImage, 'src'> & {
    alt?: string;
    src?: string;
    title?: { [key: string]: string };
  };
