import React, { useMemo } from 'react';
import { useHits } from 'react-instantsearch';
import { useTranslations } from 'use-intl';

const AccumalativeTrace = () => {
  const translate = useTranslations();

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
        {translate('product.showing', {
          current: accumulativeHitsCount,
          total: results.nbHits ?? 0,
        })}
      </p>
    </div>
  );
};

export default AccumalativeTrace;
