import { renderHook } from '__test__/utils';
import useCloseFlyouts from '.';

describe('useCloseFlyouts', () => {
  it('should trigger the ESC key when closeFlyouts is called', () => {
    const mockEventHandler = jest.fn();

    document.addEventListener('keyup', mockEventHandler);

    const { result } = renderHook(() => useCloseFlyouts());
    result.current();

    const { key: eventKey } = mockEventHandler.mock.calls[0][0];

    expect(mockEventHandler).toHaveBeenCalledTimes(1);
    expect(eventKey).toBe('Escape');

    document.removeEventListener('keyup', mockEventHandler);
  });
});
