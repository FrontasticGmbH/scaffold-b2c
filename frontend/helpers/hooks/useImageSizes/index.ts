import { useCallback } from 'react';
import * as screensizes from 'helpers/utils/screensizes';

export interface UseImageSizesParams {
  sm?: number;
  md?: number;
  lg?: number;
  defaultSize?: number;
}

const useImageSizes = ({ sm, md, lg, defaultSize = 1 }: UseImageSizesParams) => {
  const stackImageSizes = useCallback((imageSizes: string, breakpoint: number, size: number) => {
    return `(max-width: ${breakpoint}px) ${size * 100}vw, ` + imageSizes;
  }, []);

  const calculateSizes = useCallback(() => {
    let imageSizes = `${defaultSize * 100}vw`;

    imageSizes = stackImageSizes(imageSizes, screensizes.desktop, lg ?? defaultSize);
    imageSizes = stackImageSizes(imageSizes, screensizes.tablet, md ?? lg ?? defaultSize);
    imageSizes = stackImageSizes(imageSizes, screensizes.mobile, sm ?? md ?? lg ?? defaultSize);

    return imageSizes;
  }, [sm, md, lg, defaultSize, stackImageSizes]);

  return calculateSizes();
};

export default useImageSizes;
