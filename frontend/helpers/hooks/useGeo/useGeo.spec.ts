import { useParams } from 'next/navigation';
import { renderHook } from '__test__/utils';
import { getLocalizationInfo } from 'project.config';
import useGeo from './';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('project.config', () => ({
  getLocalizationInfo: jest.fn(),
}));

describe('useGeo', () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    jest.clearAllMocks();

    (useParams as jest.Mock).mockReturnValue({ locale: 'en-US' });
    (getLocalizationInfo as jest.Mock).mockReturnValue({ countryCode: 'US' });
  });

  describe('useGeo', () => {
    it('should return empty object for invalid zipcode', async () => {
      const { result } = renderHook(() => useGeo());

      const response = await result.current.getInfoByZipcode('12');
      expect(response).toEqual({});
      expect(getLocalizationInfo).not.toHaveBeenCalled();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should fetch zipcode info with correct country code', async () => {
      const mockZipcodeData = {
        'post code': '12345',
        country: 'United States',
        places: [{ 'place name': 'Test City' }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockZipcodeData),
      });

      const { result } = renderHook(() => useGeo());

      const response = await result.current.getInfoByZipcode('12345');

      expect(mockFetch).toHaveBeenCalledWith('https://api.zippopotam.us/us/12345');

      expect(response).toEqual(mockZipcodeData);
    });
  });
});
