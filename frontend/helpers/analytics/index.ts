'use client';

import { GA_TRACKING_ID } from 'helpers/constants/googleAnalytics';

export interface GAEventPayload {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

class AnalyticsService {
  private isInitialized = false;
  private isAvailable = !!GA_TRACKING_ID;

  initialize(): void {
    if (!this.isAvailable || typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;

    // Prevent multiple script injections
    if (!document.querySelector(`script[src*="${GA_TRACKING_ID}"]`)) {
      const scriptLoader = document.createElement('script');
      scriptLoader.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      scriptLoader.async = true;
      document.head.appendChild(scriptLoader);
    }

    if (!document.querySelector('script[data-ga-initializer]')) {
      const scriptInitializer = document.createElement('script');
      scriptInitializer.setAttribute('data-ga-initializer', 'true');
      scriptInitializer.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}');
      `;
      document.head.appendChild(scriptInitializer);
    }
  }

  trackEvent(eventName: string, payload: GAEventPayload): void {
    if (!this.isAvailable || typeof window === 'undefined') return;

    if (typeof window.gtag !== 'function') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...payload,
      });
      return;
    }

    window.gtag('event', eventName, payload);
  }

  get available(): boolean {
    return this.isAvailable;
  }
}

// singleton instance
export const analyticsService = new AnalyticsService();

export const trackEvent = (eventName: string, payload: GAEventPayload): void => {
  analyticsService.trackEvent(eventName, payload);
};

export const isAnalyticsAvailable = (): boolean => {
  return analyticsService.available;
};

export default analyticsService;
