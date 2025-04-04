import { FC, useState, useEffect, useRef, useCallback } from 'react';
import Image from 'components/commercetools-ui/atoms/image';
import useClassNames from 'helpers/hooks/useClassNames';
import { classnames } from 'helpers/utils/classnames';

interface GalleryProps {
  images: Array<string>;
  inModalVersion?: boolean;
}

const Gallery: FC<GalleryProps> = ({ images, inModalVersion }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const containerClassName = useClassNames(['relative', inModalVersion ? 'h-[250px]' : 'h-[447px]']);

  const snapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!snapContainerRef.current) return;

    // Use a more efficient threshold
    const observer = new IntersectionObserver(
      (entries) => {
        // Process only entries that are intersecting
        const intersectingEntry = entries.find((entry) => entry.isIntersecting);
        if (intersectingEntry) {
          const childIndex = Array.from(snapContainerRef.current?.children ?? []).findIndex(
            (child) => child === intersectingEntry.target,
          );

          setActiveIndex(childIndex);
        }
      },
      { threshold: 0.5 },
    );

    const children = Array.from(snapContainerRef.current.children);
    const visibleElements = children.slice(0, 3); // Just observe first few
    visibleElements.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  const slideTo = useCallback((index: number) => {
    if (!snapContainerRef.current) return;

    const width = snapContainerRef.current.clientWidth;

    snapContainerRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
  }, []);

  return (
    <div className="gap-y-34 px-4 md:mb-50">
      <div className={containerClassName}>
        <div className="hidden lg:block">
          <Image
            data-testid="main-gallery-image"
            src={images[activeIndex]}
            suffix="large"
            style={{ objectFit: 'contain' }}
            sizes="(min-width: 1024px) 50vw, 1px"
            fill
            priority={true}
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className="block lg:hidden">
          <div className="scrollbar-hide flex snap-x snap-mandatory overflow-x-scroll" ref={snapContainerRef}>
            {images?.map((image, index) => (
              <div
                key={index}
                className={classnames(
                  'relative w-full shrink-0 snap-center snap-always',
                  inModalVersion ? 'h-250' : 'h-[447px]',
                )}
              >
                <Image
                  src={image}
                  suffix="large"
                  sizes="(max-width: 1023px) 100vw, 1px"
                  style={{ objectFit: 'contain' }}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 pt-12">
            {Array.from({ length: images.length }).map((_, index) => (
              <div
                key={index}
                className={classnames(
                  'size-8 rounded-full',
                  index === activeIndex ? 'bg-neutral-600' : 'bg-neutral-300',
                )}
                onClick={() => slideTo(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {!inModalVersion && (
        <div className="mt-16 hidden gap-x-18 md:flex">
          {images?.map((image, index) => (
            <div
              key={index}
              className={`relative size-112 rounded-md border p-7 ${
                index == activeIndex ? 'border-neutral-500' : 'border-neutral-400'
              }`}
            >
              <div className="relative size-full">
                <Image
                  data-testid={`thumbnail-${index}`}
                  src={image}
                  suffix="small"
                  className={`rounded-md p-7 hover:cursor-pointer`}
                  onClick={() => setActiveIndex(index)}
                  style={{ objectFit: 'contain' }}
                  fill
                  loading={'lazy'}
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
