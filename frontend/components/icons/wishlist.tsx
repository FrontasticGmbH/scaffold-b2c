import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';

type Props = {
  className?: string;
  totalWishlistItems: number;
};

const Icon: React.FC<Props> = ({ className, totalWishlistItems }: Props) => (
  <>
    {totalWishlistItems > 0 && <span className="absolute -right-10 -top-3 size-10 rounded-full bg-green-500" />}
    <HeartIcon className={className} />
  </>
);

export default Icon;
