import { DateHelpers } from '.';

describe('DateHelpers', () => {
  it('should format time correctly', () => {
    const date = new Date('10/09/2023, 03:24:00');
    const formattedTime = DateHelpers.formatTime(date);

    expect(formattedTime).toEqual('3:24AM');
  });

  it('should format month correctly', () => {
    expect(DateHelpers.formatMonth(4)).toBe('04');
    expect(DateHelpers.formatMonth(10)).toBe('10');
  });

  it('should format day correctly', () => {
    expect(DateHelpers.formatDay(1)).toBe('01');
    expect(DateHelpers.formatDay(16)).toBe('16');
  });

  it('should format any date passed to it', () => {
    const formattedDate = DateHelpers.formatDate('10/1/2021, 01:40');

    expect(formattedDate).toBe('05/09, 1:40AM');
  });
});
