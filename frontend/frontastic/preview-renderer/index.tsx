'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Notifier } from 'frontastic/lib/notifier';
import Renderer from 'frontastic/renderer';
import { PreviewRendererProps } from './types';

const PreviewRenderer = ({ data, params, searchParams, categories }: PreviewRendererProps) => {
  const [currentHighlight, setCurrentHighlight] = useState<string>();

  const notifier = useRef<Notifier>(null) as React.MutableRefObject<Notifier>;

  const handleRefresh = () => {
    // Do a proper refresh and no full reload
    window.location = window.location;
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
        { previewId: data.previewId, customer: 'Demo' },
        {
          Refresh: handleRefresh,
          Highlight: handleHighlight,
          EndHighlight: handleEndHighlight,
        },
      );
      notifier.current.connect();
    }
  }, [currentHighlight, data?.previewId]);

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
      currentHighlight={currentHighlight as string}
    />
  );
};

export default PreviewRenderer;
