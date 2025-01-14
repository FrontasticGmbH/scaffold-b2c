import { formatLocaleName } from './';

describe('formatLocaleName', () => {
  it('should format a standard locale name', () => {
    const result = formatLocaleName('en-US');
    expect(result).toBe('EN');
  });

  it('should handle locale names with different lengths', () => {
    const result = formatLocaleName('es');
    expect(result).toBe('ES');
  });

  it('should handle empty strings gracefully', () => {
    const result = formatLocaleName('');
    expect(result).toBe('');
  });
});
