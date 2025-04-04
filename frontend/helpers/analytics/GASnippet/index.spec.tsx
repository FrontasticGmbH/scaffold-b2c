import { render, screen } from '@testing-library/react';
import { analyticsService, isAnalyticsAvailable } from 'helpers/analytics';
import GASnippet from './index';

jest.mock('helpers/analytics', () => {
  const mockAnalyticsService = {
    initialize: jest.fn(),
  };

  return {
    analyticsService: mockAnalyticsService,
    isAnalyticsAvailable: jest.fn(),
    __esModule: true,
    default: mockAnalyticsService,
  };
});

describe('GASnippet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes analytics when mounted if available', () => {
    (isAnalyticsAvailable as jest.Mock).mockReturnValue(true);
    render(<GASnippet />);

    expect(isAnalyticsAvailable).toHaveBeenCalled();
    expect(analyticsService.initialize).toHaveBeenCalled();
  });

  test('does not initialize analytics when not available', () => {
    (isAnalyticsAvailable as jest.Mock).mockReturnValue(false);
    render(<GASnippet />);

    expect(isAnalyticsAvailable).toHaveBeenCalled();
    expect(analyticsService.initialize).not.toHaveBeenCalled();
  });

  test('component renders nothing', () => {
    render(<GASnippet />);
    expect(screen.queryByTestId('ga-snippet')).not.toBeInTheDocument();
  });

  test('component only initializes analytics once', () => {
    (isAnalyticsAvailable as jest.Mock).mockReturnValue(true);
    const { rerender } = render(<GASnippet />);

    expect(analyticsService.initialize).toHaveBeenCalledTimes(1);

    rerender(<GASnippet />);
    expect(analyticsService.initialize).toHaveBeenCalledTimes(1);
  });
});
