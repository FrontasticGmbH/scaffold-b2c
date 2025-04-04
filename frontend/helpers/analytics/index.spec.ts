import { analyticsService, trackEvent, isAnalyticsAvailable } from './index';

// Mock GA_TRACKING_ID
jest.mock('helpers/constants/googleAnalytics', () => ({
  GA_TRACKING_ID: 'test-tracking-id',
}));

jest.mock('./index', () => {
  const originalModule = jest.requireActual('./index');

  return {
    ...originalModule,
    trackEvent: jest.fn(),
    isAnalyticsAvailable: jest.fn().mockReturnValue(true),
  };
});

describe('Analytics Service', () => {
  let createElementSpy: jest.SpyInstance;
  let appendChildSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    const createMockScript = () => ({
      tagName: 'script',
      src: '',
      async: false,
      innerHTML: '',
      setAttribute: jest.fn(),
    });

    createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'script') {
        return createMockScript() as any;
      }
      return jest.requireActual('jsdom').document.createElement(tagName);
    });

    appendChildSpy = jest.spyOn(document.head, 'appendChild').mockImplementation(() => null as any);

    (isAnalyticsAvailable as jest.Mock).mockReturnValue(true);

    Object.defineProperty(analyticsService, 'isInitialized', { value: false, writable: true });
    Object.defineProperty(analyticsService, 'isAvailable', { value: true, writable: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isAnalyticsAvailable', () => {
    test('returns true when tracking ID exists', () => {
      expect(isAnalyticsAvailable()).toBe(true);
    });

    test('returns false when tracking ID is missing', () => {
      (isAnalyticsAvailable as jest.Mock).mockReturnValue(false);
      expect(isAnalyticsAvailable()).toBe(false);
    });
  });

  describe('trackEvent', () => {
    test('calls trackEvent with correct parameters', () => {
      trackEvent('test-event', { test: 'data' });

      expect(trackEvent).toHaveBeenCalledWith('test-event', { test: 'data' });
    });

    test('handles analytics being unavailable', () => {
      (isAnalyticsAvailable as jest.Mock).mockReturnValue(false);

      trackEvent('test-event', { test: 'data' });

      expect(trackEvent).toHaveBeenCalledWith('test-event', { test: 'data' });
    });
  });

  describe('analyticsService', () => {
    test('initialize adds script tags to document head', () => {
      analyticsService.initialize();

      expect(createElementSpy).toHaveBeenCalledTimes(2);
      expect(createElementSpy).toHaveBeenCalledWith('script');
      expect(appendChildSpy).toHaveBeenCalledTimes(2);
    });

    test('initialize does nothing when analytics is not available', () => {
      Object.defineProperty(analyticsService, 'isAvailable', { value: false });

      analyticsService.initialize();

      expect(createElementSpy).not.toHaveBeenCalled();
      expect(appendChildSpy).not.toHaveBeenCalled();
    });

    test('initialize only runs once even if called multiple times', () => {
      analyticsService.initialize();

      createElementSpy.mockClear();
      appendChildSpy.mockClear();

      analyticsService.initialize();

      expect(createElementSpy).not.toHaveBeenCalled();
      expect(appendChildSpy).not.toHaveBeenCalled();
    });
  });
});
