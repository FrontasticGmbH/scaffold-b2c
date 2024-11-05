import { StringHelpers } from '.';

describe('[Utility] String helpers', () => {
  it('Checks if a given string is a valid number', () => {
    expect(StringHelpers.isNumeric('100')).toBe(true);
    expect(StringHelpers.isNumeric('100.00')).toBe(true);

    expect(StringHelpers.isNumeric('abc')).toBe(false);
    expect(StringHelpers.isNumeric('abc12')).toBe(false);
    expect(StringHelpers.isNumeric('12abc12')).toBe(false);
    expect(StringHelpers.isNumeric('12abc')).toBe(false);
    expect(StringHelpers.isNumeric('1,000.00')).toBe(false);
    expect(StringHelpers.isNumeric('$1,000.00')).toBe(false);
  });

  it('Capitalizes the given string correctly', () => {
    expect(StringHelpers.capitalise('mark')).toBe('Mark');
    expect(StringHelpers.capitalise('Mark')).toBe('Mark');
  });
});
