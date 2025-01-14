import { useSearchParams } from 'next/navigation';
import { renderHook } from '__test__/utils';
import useHash from '.';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('useHash', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty string for hash and null for id when they do not exists', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === 'hash') return null;
        if (key === 'id') return null;
        return null;
      }),
    });

    const { result } = renderHook(() => useHash());

    expect(result.current).toEqual(['', null]);
  });

  it('should return correct hash and id when they exists', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === 'hash') return 'testHashValue';
        if (key === 'id') return 'testId';
        return null;
      }),
    });

    const { result } = renderHook(() => useHash());

    const [hash, id] = result.current;

    expect(hash).toBe('testHashValue');
    expect(id).toBe('testId');
  });
});
