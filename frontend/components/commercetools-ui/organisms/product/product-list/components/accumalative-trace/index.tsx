import React from 'react';
import { useFormat } from 'helpers/hooks/useFormat';
import { useProductList } from '../../context';

interface Props {
  currentItems: number;
}

const AccumalativeTrace: React.FC<Props> = ({ currentItems }) => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { totalItems } = useProductList();

  return (
    <div className="absolute bottom-72 left-1/2 -translate-x-1/2">
      <p>
        {formatProductMessage({
          id: 'showing',
          defaultMessage: 'Showing {current} of {total}',
          values: { current: currentItems, total: totalItems },
        })}
      </p>
    </div>
  );
};

export default AccumalativeTrace;
