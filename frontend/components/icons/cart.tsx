import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

type Props = {
  className?: string;
  totalCartItems?: number;
  counterClassName?: string;
};

const Icon: React.FC<Props> = ({ className, totalCartItems = 0, counterClassName }) => (
  <div className="relative">
    {totalCartItems > 0 && (
      <>
        <span className="absolute right-[-6px] top-[-3px] h-10 w-10 rounded-full bg-green-500" />
        <span
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-9 text-secondary-black ${counterClassName}`}
        >
          {totalCartItems}
        </span>
      </>
    )}
    <ShoppingBagIcon className={className} stroke="#494949" />
  </div>
);

export default Icon;
