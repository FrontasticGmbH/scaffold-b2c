'use client';

import { useEffect, useCallback, memo } from 'react';
import analyticsService, { isAnalyticsAvailable } from 'helpers/analytics';

const GASnippet = () => {
  const initializeAnalytics = useCallback(() => {
    if (isAnalyticsAvailable()) {
      analyticsService.initialize();
    }
  }, []);

  useEffect(() => {
    initializeAnalytics();
  }, [initializeAnalytics]);

  return null;
};

export default memo(GASnippet);
