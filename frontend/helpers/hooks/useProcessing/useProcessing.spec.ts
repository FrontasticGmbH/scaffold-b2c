import { renderHook, act } from '__test__/utils';
import useProcessing from '.';

describe('useProcessing', () => {
  it('should have processing as false by default', () => {
    const { result } = renderHook(() => useProcessing());

    expect(result.current.processing).toBe(false);
  });

  it('should start processing when startProcessing is called', () => {
    const { result } = renderHook(() => useProcessing());
    act(() => {
      result.current.startProcessing();
    });
    expect(result.current.processing).toBe(true);
  });

  it('should stop processing when stopProcessing is called', () => {
    const { result } = renderHook(() => useProcessing());

    act(() => {
      result.current.startProcessing();
    });

    expect(result.current.processing).toBe(true);

    act(() => {
      result.current.stopProcessing();
    });

    expect(result.current.processing).toBe(false);
  });
});
