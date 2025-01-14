import { renderHook, act } from '__test__/utils';
import useScrollBlock from '.';

describe('useScrollBlock', () => {
  it('should allow scrolling by default', () => {
    const { result } = renderHook(() => useScrollBlock());

    expect(result.current.isBlocked).toBe(false);
  });

  it('should block scrolling when blockScroll(true) is called', () => {
    const { result } = renderHook(() => useScrollBlock());

    act(() => {
      result.current.blockScroll(true);
    });

    expect(result.current.isBlocked).toBe(true);
  });

  it('should allow scrolling when blockScroll(false) is called', () => {
    const { result } = renderHook(() => useScrollBlock());

    act(() => {
      result.current.blockScroll(true);
    });

    expect(result.current.isBlocked).toBe(true);

    act(() => {
      result.current.blockScroll(false);
    });

    expect(result.current.isBlocked).toBe(false);
  });
});
