import { renderHook, act } from '__test__/utils';
import { useDebounce } from '.';

describe('useDebounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return the debounce value after a delay', () => {
    const { result } = renderHook(() => useDebounce('test'));
    expect(result.current).toBe('test');
  });

  it('should debounce the value with default delay', () => {
    const { result, rerender } = renderHook((props) => useDebounce(props, 500), { initialProps: 'test' });
    expect(result.current).toBe('test');

    rerender('updated value');

    expect(result.current).toBe('test');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated value');
  });

  it('should use custom delay when provided', () => {
    const delay = 1000;
    const { result, rerender } = renderHook((props) => useDebounce(props, delay), { initialProps: 'test' });

    expect(result.current).toBe('test');

    rerender('updated');

    expect(result.current).toBe('test');

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(result.current).toBe('updated');
  });
});
