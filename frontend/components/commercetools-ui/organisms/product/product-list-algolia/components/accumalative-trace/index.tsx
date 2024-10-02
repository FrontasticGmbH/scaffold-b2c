import React, { useMemo } from 'react';
import { useHits } from 'react-instantsearch';
import { useFormat } from 'helpers/hooks/useFormat';

const AccumalativeTrace = () => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { hits, results } = useHits();

  const accumulativeHitsCount = useMemo(() => {
    if (!results) return 0;

    const { page, hitsPerPage } = results;

    return page === 0 ? hits.length : page * hitsPerPage + hits.length;
  }, [results, hits]);

  if (!results?.nbHits) return <></>;

  return (
    <div className="absolute bottom-72 left-1/2 -translate-x-1/2">
      <p>
        {formatProductMessage({
          id: 'showing',
          defaultMessage: 'Showing {current} of {total}',
          values: { current: accumulativeHitsCount, total: results.nbHits ?? 0 },
        })}
      </p>
    </div>
  );
};

export default AccumalativeTrace;
