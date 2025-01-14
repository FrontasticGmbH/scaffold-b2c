import { renderHook } from '__test__/utils';
import useImageSizes from '.';

describe('useImageSizes', () => {
  it('should return the right values when only defaultSize is passed', () => {
    const { result } = renderHook(() => useImageSizes({ defaultSize: 0.5 }));

    expect(result.current).toBe('(max-width: 480px) 50vw, (max-width: 744px) 50vw, (max-width: 1024px) 50vw, 50vw');
  });

  it('should return the right values when an empty object is passed', () => {
    const { result } = renderHook(() => useImageSizes({}));

    expect(result.current).toBe('(max-width: 480px) 100vw, (max-width: 744px) 100vw, (max-width: 1024px) 100vw, 100vw');
  });

  it('should return the correct values when all fields are passed', () => {
    const { result } = renderHook(() => useImageSizes({ md: 0.5, lg: 0.25, defaultSize: 0.25 }));

    expect(result.current).toBe('(max-width: 480px) 50vw, (max-width: 744px) 50vw, (max-width: 1024px) 25vw, 25vw');
  });
});
