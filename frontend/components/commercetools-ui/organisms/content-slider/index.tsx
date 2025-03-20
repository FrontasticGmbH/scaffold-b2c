import { FC, useMemo } from 'react';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import useTouchDevice from 'helpers/hooks/useTouchDevice';
import { smallMobile, desktop, tablet, mediumDesktop } from 'helpers/utils/screensizes';
import ContentSliderSlide from './slide';
import { ContentSliderProps } from './types';
import Wrapper from '../../../HOC/wrapper';
import Slider from '../../atoms/slider';
import Subtitle from '../../atoms/subtitle';

const ContentSlider: FC<ContentSliderProps> = ({ title, subtitle, slides }) => {
  const [isTabletSize] = useMediaQuery(tablet);
  const [isDesktopSize] = useMediaQuery(desktop);
  const [isMediumDesktopSize] = useMediaQuery(mediumDesktop);

  const { isTouchDevice } = useTouchDevice();

  const slideWidth = useMemo(() => {
    if (isDesktopSize) return 432;
    else return isTabletSize ? 356 : 244;
  }, [isDesktopSize, isTabletSize]);

  const slidesElement = useMemo(
    () => slides.map((slide) => <ContentSliderSlide key={slide.title} {...slide} />),
    [slides],
  );

  return (
    <Wrapper clearDefaultStyles className="pl-16 md:pl-24 lg:pl-48 xl:px-48">
      {title && <h3 className="mb-12 text-20 md:text-22 lg:text-28">{title}</h3>}
      {subtitle && <Subtitle className="mb-24" subtitle={subtitle} />}
      {isMediumDesktopSize ? (
        <div className="flex w-full gap-24">{slidesElement}</div>
      ) : (
        <div className="relative w-full">
          <Slider
            dots={false}
            solidArrows
            arrows={isDesktopSize}
            allowArrowsOnTouchDevice
            allowTouchMove={isTouchDevice}
            slideWidth={slideWidth}
            nextButtonStyles={{ transform: 'translateY(-150%)', right: '10px' }}
            prevButtonStyles={{ transform: 'translateY(-150%)', left: '10px' }}
            breakpoints={{
              [smallMobile]: {
                spaceBetween: 12,
              },
              [tablet]: {
                spaceBetween: 18,
              },
              [desktop]: {
                spaceBetween: 24,
              },
            }}
          >
            {slidesElement}
          </Slider>
        </div>
      )}
    </Wrapper>
  );
};
export default ContentSlider;

export * from './types';
