import mapCosts from '.';

describe('[Utility] mapCosts', () => {
  it('Calculates empty costs correctly', () => {
    const result = mapCosts({});

    expect(result.subtotal.centAmount).toBe(0);
    expect(result.discount.centAmount).toBe(0);
    expect(result.tax.centAmount).toBe(0);
    expect(result.shipping.centAmount).toBe(0);
    expect(result.total.centAmount).toBe(0);
    expect(result.total.currencyCode).toBe('USD');
    expect(result.total.fractionDigits).toBe(2);
  });

  it('Calculates costs excluding taxes correctly', () => {
    const result = mapCosts({
      cart: {
        lineItems: [
          {
            count: 1,
            price: { centAmount: 100000 },
            totalPrice: { centAmount: 100000 },
            taxRate: { includedInPrice: false },
            taxed: { taxAmount: { centAmount: 1000 } },
          },
          {
            count: 2,
            price: { centAmount: 50000 },
            totalPrice: { centAmount: 50000 * 2 },
            taxRate: { includedInPrice: false },
            taxed: { taxAmount: { centAmount: 200 } },
          },
        ],
        taxed: {
          taxAmount: { centAmount: 1700 },
        },
        shippingInfo: {
          shippingMethodId: '',
          price: { centAmount: 5000 },
          taxRate: { includedInPrice: false },
          taxed: { taxAmount: { centAmount: 500 } },
        },
        sum: {
          centAmount: 100000 + 50000 * 2 + 5000,
        },
      },
    });

    expect(result.subtotal.centAmount).toBe(100000 + 50000 * 2);
    expect(result.discount.centAmount).toBe(0);
    expect(result.tax.centAmount).toBe(1700);
    expect(result.shipping.centAmount).toBe(5000);
    expect(result.total.centAmount).toBe(100000 + 50000 * 2 + 5000 + 1700);
    expect(result.total.currencyCode).toBe('USD');
    expect(result.total.fractionDigits).toBe(2);
  });

  it('Calculates costs including taxes correctly', () => {
    const result = mapCosts({
      cart: {
        lineItems: [
          {
            count: 1,
            price: { centAmount: 100000 },
            totalPrice: { centAmount: 100000 },
            taxRate: { includedInPrice: true },
            taxed: { taxAmount: { centAmount: 1000 } },
          },
          {
            count: 2,
            price: { centAmount: 50000 },
            totalPrice: { centAmount: 50000 * 2 },
            taxRate: { includedInPrice: true },
            taxed: { taxAmount: { centAmount: 200 } },
          },
        ],
        taxed: {
          taxAmount: { centAmount: 1700 },
        },
        shippingInfo: {
          shippingMethodId: '',
          price: { centAmount: 5000 },
          taxRate: { includedInPrice: true },
          taxed: { taxAmount: { centAmount: 500 } },
        },
        sum: {
          centAmount: 100000 + 50000 * 2 + 5000,
        },
      },
    });

    expect(result.subtotal.centAmount).toBe(100000 - 1000 + (50000 * 2 - 200));
    expect(result.discount.centAmount).toBe(0);
    expect(result.tax.centAmount).toBe(1700);
    expect(result.shipping.centAmount).toBe(5000 - 500);
    expect(result.total.centAmount).toBe(100000 + 50000 * 2 + 5000);
    expect(result.total.currencyCode).toBe('USD');
    expect(result.total.fractionDigits).toBe(2);
  });

  it('Applies discount costs correctly', () => {
    const result = mapCosts({
      cart: {
        lineItems: [
          {
            count: 1,
            price: { centAmount: 100000 },
            totalPrice: { centAmount: 100000 - 30000 },
            taxRate: { includedInPrice: true },
            taxed: { taxAmount: { centAmount: 1000 } },
          },
          {
            count: 2,
            price: { centAmount: 50000 },
            totalPrice: { centAmount: (50000 - 5000) * 2 },
            taxRate: { includedInPrice: true },
            taxed: { taxAmount: { centAmount: 200 } },
          },
        ],
        taxed: {
          taxAmount: { centAmount: 1700 },
        },
        shippingInfo: {
          shippingMethodId: '',
          price: { centAmount: 5000 },
          taxRate: { includedInPrice: true },
          taxed: { taxAmount: { centAmount: 500 } },
        },
        sum: {
          centAmount: 100000 - 30000 + (50000 - 5000) * 2 + 5000,
        },
      },
    });

    expect(result.subtotal.centAmount).toBe(100000 - 1000 + (50000 * 2 - 200));
    expect(result.discount.centAmount).toBe(30000 + 5000 * 2);
    expect(result.tax.centAmount).toBe(1700);
    expect(result.shipping.centAmount).toBe(5000 - 500);
    expect(result.total.centAmount).toBe(100000 - 30000 + (50000 - 5000) * 2 + 5000);
    expect(result.total.currencyCode).toBe('USD');
    expect(result.total.fractionDigits).toBe(2);
  });

  it('Applies cart discounts correctly', () => {
    const result = mapCosts({
      cart: {
        discountedAmount: { fractionDigits: 2, centAmount: 7182, currencyCode: 'USD' },
        lineItems: [
          {
            count: 1,
            price: { centAmount: 100000 },
            totalPrice: { centAmount: 100000 - 30000 },
            taxRate: { includedInPrice: true },
            taxed: { taxAmount: { centAmount: 1000 } },
          },
          {
            count: 2,
            price: { centAmount: 50000 },
            totalPrice: { centAmount: (50000 - 5000) * 2 },
            taxRate: { includedInPrice: true },
            taxed: { taxAmount: { centAmount: 200 } },
          },
        ],
        taxed: {
          taxAmount: { centAmount: 1700 },
        },
        shippingInfo: {
          shippingMethodId: '',
          price: { centAmount: 5000 },
          taxRate: { includedInPrice: true },
          taxed: { taxAmount: { centAmount: 500 } },
        },
        sum: {
          centAmount: 100000 - 30000 + (50000 - 5000) * 2 + 5000,
        },
      },
    });

    expect(result.subtotal.centAmount).toBe(100000 - 1000 + (50000 * 2 - 200));
    expect(result.discount.centAmount).toBe(7182 + 30000 + 5000 * 2);
  });

  it('Can determine estimated shipping correctly', () => {
    let result = mapCosts({
      cart: {
        availableShippingMethods: [{ shippingMethodId: '', rates: [{ price: { centAmount: 5000 } }] }],
        sum: { centAmount: 5000 },
      },
    });

    expect(result.shipping.centAmount).toBe(5000);
    expect(result.isEstimatedShipping).toBe(true);

    result = mapCosts({
      cart: {
        shippingInfo: {
          shippingMethodId: '',
          price: { centAmount: 5000 },
        },
        sum: { centAmount: 5000 },
      },
    });

    expect(result.shipping.centAmount).toBe(5000);
    expect(result.isEstimatedShipping).toBe(false);
  });
});
