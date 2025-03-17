import React from 'react';
import { useTranslations } from 'use-intl';
import { useProductList } from '../../context';

interface Props {
  currentItems: number;
}

const AccumalativeTrace: React.FC<Props> = ({ currentItems }) => {
  const translate = useTranslations();

  const { totalItems } = useProductList();

  return (
    <div className="absolute bottom-72 left-1/2 -translate-x-1/2">
      <p>
        {translate('product.showing', {
          current: currentItems,
          total: totalItems,
        })}
      </p>
    </div>
  );
};

export default AccumalativeTrace;
