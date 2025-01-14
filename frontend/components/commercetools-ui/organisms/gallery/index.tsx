import { FC, useRef, useState } from 'react';
import Swiper from 'swiper';
import Image from 'components/commercetools-ui/atoms/image';
import Slider from 'components/commercetools-ui/atoms/slider';
import useClassNames from 'helpers/hooks/useClassNames';
import useMediaQuery from 'helpers/hooks/useMediaQuery';
import { classnames } from 'helpers/utils/classnames';
import { desktop, tablet } from 'helpers/utils/screensizes';

interface GalleryProps {
  images: Array<string>;
  inModalVersion?: boolean;
}

const Gallery: FC<GalleryProps> = ({ images, inModalVersion }) => {
  const swiperRef = useRef<Swiper>();
  const [activeSlide, setActiveSlide] = useState(0);

  const [isTabletSize] = useMediaQuery(tablet);
  const [isDesktopSize] = useMediaQuery(desktop);

  const [isLoading, setIsLoading] = useState(true);

  const slideTo = (slide: number) => {
    swiperRef.current?.slideTo(slide);
  };

  const handleSlide = (swiper: Swiper) => {
    setActiveSlide(swiper.realIndex);
  };

  const containerClassName = useClassNames(['relative mx-20 lg:mx-auto', inModalVersion ? 'h-[250px]' : 'h-[447px]']);

  return (
    <div className="gap-y-34 px-4 md:mb-50">
      <div className={containerClassName}>
        <div className={isLoading ? 'block' : 'hidden'}>
          <Image src={images[0]} loading="eager" suffix="large" style={{ objectFit: 'contain' }} fill />
        </div>

        <div className={isLoading ? 'hidden' : 'block'}>
          <Slider
            onSlideChange={handleSlide}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            arrows={isTabletSize && images.length > 1}
            dots={!isTabletSize && images.length > 1}
            prevButtonStyles={{ left: isDesktopSize ? -10 : -4 }}
            nextButtonStyles={{ right: isDesktopSize ? -10 : -4 }}
            compactNavigation={inModalVersion}
            slidesPerView={1}
            loop={!!images.length}
            onInit={() => setIsLoading(false)}
          >
            {images?.map((image, index) => (
              <div key={index} className={classnames('relative w-full', inModalVersion ? 'h-250' : 'h-[447px]')}>
                <Image
                  src={image}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  suffix="large"
                  style={{ objectFit: 'contain' }}
                  fill
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {!inModalVersion && (
        <div className="mt-16 hidden gap-x-18 md:flex">
          {images?.map((image, index) => (
            <div
              key={index}
              className={`relative size-112 rounded-md border p-7 ${
                index == activeSlide % images.length ? 'border-neutral-500' : 'border-neutral-400'
              }`}
            >
              <div className="relative size-full">
                <Image
                  src={image}
                  suffix="small"
                  className={`rounded-md p-7 hover:cursor-pointer`}
                  onClick={() => slideTo(index)}
                  style={{ objectFit: 'contain' }}
                  fill
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
