import { fireEvent, renderHook } from '__test__/utils';
import useCurrentBreakpoint from '.';

describe('useCurrentBreakpoint', () => {
  it('should return desktop by default', () => {
    const { result } = renderHook(() => useCurrentBreakpoint());

    expect(result.current).toBe('desktop');
  });

  it('should return the corresponding breakpoint when the screen is resized', () => {
    const { result } = renderHook(() => useCurrentBreakpoint());
    window.innerWidth = 600;
    fireEvent(window, new Event('resize'));

    expect(result.current).toBe('mobile');
  });
});
