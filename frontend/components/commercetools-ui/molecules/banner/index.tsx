import React, { useState } from 'react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/outline';
import Button from 'components/commercetools-ui/atoms/button';
import Image, { ImageProps } from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';
import { classnames } from 'helpers/utils/classnames';
import { cva } from 'helpers/utils/cva';
import { Reference } from 'types/reference';

export interface BannerProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: Reference;
  image?: ImageProps;
  size?: 'sm' | 'md' | 'lg';
}

const Banner = ({ title, description, buttonText, buttonLink, image, size = 'md' }: BannerProps) => {
  const [isClosed, setIsClosed] = useState(false);

  const resolveClassName = cva({
    size: {
      sm: 'p-20 md:p-24 lg:p-32',
      md: 'p-24 md:p-32 lg:p-40',
      lg: 'px-24 py-32 md:p-48 lg:px-64 lg:py-80',
    },
  });

  const displayInlineView = !description;

  if (isClosed) return <></>;

  return (
    <div className="px-16 py-24 md:px-24 lg:px-20 xl:px-48">
      <div
        className={classnames('relative rounded-lg', resolveClassName(`size.${size}`).toString(), {
          'flex items-center justify-between': displayInlineView,
        })}
      >
        <button
          className="absolute right-0 top-0 z-10 -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full bg-gray-600 p-4 lg:pointer-events-none lg:hidden"
          onClick={() => setIsClosed(true)}
        >
          <CloseIcon className="size-16 stroke-[3] text-white" />
        </button>

        <Image {...image} fill className="z-[-1]" style={{ objectFit: 'cover' }} />

        <h1 className="text-28 font-bold text-gray-700 md:text-32 lg:max-w-[70%] lg:text-36 xl:max-w-[60%]">{title}</h1>

        {description && <p className="mt-4 text-gray-700 lg:max-w-[70%] lg:text-18 xl:max-w-[60%]">{description}</p>}

        {buttonText && (
          <Link link={buttonLink}>
            <Button variant="primary" size="m" className={classnames({ 'mt-20': !displayInlineView })}>
              {buttonText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Banner;
