import React from 'react';
import { useTranslations } from 'use-intl';
import useClassNames from 'helpers/hooks/useClassNames';

interface Props {
  className?: string;
}

const OutOfStock: React.FC<React.PropsWithChildren<Props>> = ({ className }) => {
  const translate = useTranslations();

  const classNames = useClassNames([
    'flex h-[25px] w-fit items-center justify-center py-4 px-8 text-12 bg-red-500 text-white',
    className,
  ]);

  return <span className={classNames}>{translate('product.sold-out')}</span>;
};

export default OutOfStock;
