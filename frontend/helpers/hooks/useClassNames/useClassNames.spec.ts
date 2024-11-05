import { renderHook } from '__test__/utils';
import useClassNames from '.';

describe('[Hook] useClassNames', () => {
  it('Evaluates class names correctly', () => {
    const { result } = renderHook(() => useClassNames(['class-1', 'class-2', 'class-3']));

    expect(result.current).toBe('class-1 class-2 class-3');
  });

  it('Removes empty classes and trims all extra white space', () => {
    const { result } = renderHook(() => useClassNames(['class-1  ', null, '', undefined, ' class-2', ' ']));

    expect(result.current).toBe('class-1 class-2');
  });

  it('Resolves object class names correctly', () => {
    const { result } = renderHook(() =>
      useClassNames([{ 'class-1': true }, { 'class-2': false }, { 'class-3': true }]),
    );

    expect(result.current).toBe('class-1 class-3');
  });

  it('Resolves string class names and object class names together', () => {
    const { result } = renderHook(() => useClassNames([{ 'class-1': true }, 'class-2', { 'class-3': true }]));

    expect(result.current).toBe('class-1 class-2 class-3');
  });
});
