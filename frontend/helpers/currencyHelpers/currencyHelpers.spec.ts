import { CurrencyHelpers } from '.';

describe('[Utility] Currency helpers', () => {
  it('Formats string currency correctly', () => {
    const result = CurrencyHelpers.formatForCurrency('10000', 'en', 'USD', 2);

    expect(result).toBe('$100.00');
  });

  it('Formats number currency correctly', () => {
    const result = CurrencyHelpers.formatForCurrency(25000, 'en', 'USD', 2);

    expect(result).toBe('$250.00');
  });

  it('Formats money currency correctly', () => {
    const result = CurrencyHelpers.formatForCurrency(
      { centAmount: 100000, currencyCode: 'USD', fractionDigits: 2 },
      'en',
    );

    expect(result).toBe('$1,000.00');
  });

  it('Performs money addition correctly', () => {
    const result = CurrencyHelpers.addCurrency(
      { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
      { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
    );

    expect(result.centAmount).toBe(20000);
    expect(result.currencyCode).toBe('USD');
    expect(result.fractionDigits).toBe(2);
  });

  it('Performs money subtraction correctly', () => {
    const result = CurrencyHelpers.subtractCurrency(
      { centAmount: 30000, currencyCode: 'USD', fractionDigits: 2 },
      { centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 },
    );

    expect(result.centAmount).toBe(20000);
    expect(result.currencyCode).toBe('USD');
    expect(result.fractionDigits).toBe(2);
  });

  it('Performs item multiplication correctly', () => {
    const result = CurrencyHelpers.multiplyCurrency({ centAmount: 10000, currencyCode: 'USD', fractionDigits: 2 }, 5);

    expect(result.centAmount).toBe(50000);
    expect(result.currencyCode).toBe('USD');
    expect(result.fractionDigits).toBe(2);
  });
});
