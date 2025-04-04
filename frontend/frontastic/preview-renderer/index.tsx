'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Notifier } from 'frontastic/lib/notifier';
import Renderer from 'frontastic/renderer';
import { PreviewRendererProps } from './types';

const PreviewRenderer = ({ data, params, searchParams, categories, flattenedCategories }: PreviewRendererProps) => {
  const [currentHighlight, setCurrentHighlight] = useState<string>();

  const notifier = useRef<Notifier>(null) as React.MutableRefObject<Notifier>;

  const customer = data.previewContext?.customerName ?? 'demo';

  const handleRefresh = () => {
    // Do a proper refresh and no full reload
    window.location.reload();
  };

  const handleEndHighlight = () => setCurrentHighlight(undefined);

  useEffect(() => {
    const handleHighlight = ({ item }: { item: string }) => {
      if (currentHighlight !== item) {
        setCurrentHighlight(item);
      }
    };
    if (data?.previewId && !notifier.current) {
      notifier.current = new Notifier(
        { previewId: data.previewId, customer },
        {
          Refresh: handleRefresh,
          Highlight: handleHighlight,
          EndHighlight: handleEndHighlight,
        },
      );
      notifier.current.connect();
    }
  }, [currentHighlight, data?.previewId, customer]);

  useEffect(() => {
    //Gtag mock function
    window.gtag = function () {};
  }, []);

  if (!data) return <></>;

  return (
    <Renderer
      data={data}
      params={params}
      searchParams={searchParams}
      categories={categories}
      flattenedCategories={flattenedCategories}
      currentHighlight={currentHighlight as string}
    />
  );
};

export default PreviewRenderer;
