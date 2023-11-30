import React, { useState, FC, Children, CSSProperties, useRef, useCallback } from 'react';
import SwiperType, { Navigation, Pagination, Thumbs } from 'swiper';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react'; // eslint-disable-line import/no-unresolved
import 'swiper/css'; // eslint-disable-line import/no-unresolved
import 'swiper/css/navigation'; // eslint-disable-line import/no-unresolved
import 'swiper/css/pagination'; // eslint-disable-line import/no-unresolved
import 'swiper/css/scrollbar'; // eslint-disable-line import/no-unresolved
import { NavigationOptions } from 'swiper/types';
import useClassNames from 'helpers/hooks/useClassNames';
import useTouchDevice from 'helpers/hooks/useTouchDevice';
import SliderNavigation, { SliderNavigationProps } from './slider-navigation';

export type SliderProps = SliderNavigationProps & {
  allowArrowsOnTouchDevice?: boolean;
  className?: string;
  containerClassName?: string;
  spaceBetween?: number;
  slidesPerView?: number;
  dots?: boolean;
  fitToSlides?: boolean;
  slideWidth?: number;
  withThumbs?: boolean;
  slideWidthIsFlexible?: boolean;
} & SwiperProps;

const Slider: FC<SliderProps> = ({
  className = '',
  containerClassName = '',
  slideWidth = 300,
  slidesPerView,
  fitToSlides = false,
  arrows = false,
  innerArrows = false,
  solidArrows = false,
  dots = true,
  spaceBetween = 20,
  withThumbs = false,
  children,
  onSwiper,
  onInit,
  allowTouchMove,
  prevButtonStyles = {},
  nextButtonStyles = {},
  prevArrowStyles = {},
  nextArrowStyles = {},
  compactNavigation,
  slideWidthIsFlexible,
  allowArrowsOnTouchDevice = false,
  ...props
}) => {
  const { isTouchDevice } = useTouchDevice();

  const [init, setInit] = useState(false);

  const handleInit = useCallback(
    (swiper: SwiperType) => {
      setTimeout(() => setInit(true));
      onInit?.(swiper);
    },
    [onInit],
  );

  const navigationPrevRef = useRef<HTMLDivElement>(null);
  const navigationNextRef = useRef<HTMLDivElement>(null);

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType>();

  const swiperRef = useRef<SwiperType>();

  const validToFit: boolean = !!fitToSlides && !!slideWidth && !!slidesPerView;
  const sliderWidth: CSSProperties['width'] =
    validToFit && slidesPerView ? `${spaceBetween * (slidesPerView - 1) + slideWidth * slidesPerView}px` : '100%';

  const containerClassNames = useClassNames([
    containerClassName,
    'slider_container relative',
    !init ? 'hidden' : 'block',
    {
      'slider__container--fit': validToFit,
      'slider__container--with-thumbs': withThumbs,
    },
  ]);
  const slidesClassName = useClassNames(['slider', className]);

  const slideProps = {
    width: slideWidthIsFlexible ? 'fit-content' : `${slideWidth}px`,
  } as React.CSSProperties;

  const slides = Children.map(children, (child) => <SwiperSlide style={slideProps}>{child}</SwiperSlide>);

  const handleOnSwiper = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    onSwiper?.(swiper);

    if (withThumbs) {
      setThumbsSwiper(swiper);
    }
  };

  const handleOnBeforeInit = (swiper: SwiperType) => {
    (swiper.params.navigation as NavigationOptions).prevEl = navigationPrevRef.current;
    (swiper.params.navigation as NavigationOptions).nextEl = navigationNextRef.current;
  };

  return (
    <div className={containerClassNames}>
      <Swiper
        key={`${allowTouchMove} ${isTouchDevice}`}
        className={slidesClassName}
        modules={[Navigation, Pagination, Thumbs]}
        thumbs={{ swiper: thumbsSwiper }}
        pagination={dots ? { clickable: true, bulletActiveClass: 'slider__bullet--active' } : false}
        slidesPerView={slidesPerView ?? 'auto'}
        spaceBetween={spaceBetween}
        style={{ width: sliderWidth }}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        onSwiper={handleOnSwiper}
        onBeforeInit={handleOnBeforeInit}
        observer
        observeParents
        onInit={handleInit}
        allowTouchMove={allowTouchMove && isTouchDevice}
        {...props}
      >
        {slides}
      </Swiper>
      <SliderNavigation
        compactNavigation={compactNavigation}
        arrows={allowArrowsOnTouchDevice ? arrows : arrows && !isTouchDevice}
        prevButtonStyles={prevButtonStyles}
        nextButtonStyles={nextButtonStyles}
        prevArrowStyles={prevArrowStyles}
        nextArrowStyles={nextArrowStyles}
        navigationPrevRef={navigationPrevRef}
        navigationNextRef={navigationNextRef}
        totalSlides={slides?.length}
        swiperRef={swiperRef?.current}
        innerArrows={innerArrows}
        solidArrows={solidArrows}
      />
    </div>
  );
};

export default Slider;
