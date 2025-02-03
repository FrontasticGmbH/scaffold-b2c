import { mapProduct } from './map-product';

describe('mapProduct', () => {
  it('should map product to match algolia component', () => {
    const item = {
      productId: 'ee3fb5e8-4b9a-48c0-ba8d-2ff4f00dcabc',
      name: 'Traditional  Sofa',
      categories: [
        {
          id: 'ae7004cf-69b0-420e-af6c-f235b8c92017',
        },
      ],
      variants: [
        {
          id: '1',
          sku: 'TLSS-01',
          images: ['https://_ZXpDL48.jpeg'],
          prices: {
            fractionDigits: 2,
            centAmount: 359900,
          },
          isOnStock: true,
        },
      ],
      __position: 2,
      objectID: '2eca75039cf911b9bbe5',
    };

    expect(mapProduct(item, 'en')).toEqual({
      productId: 'ee3fb5e8-4b9a-48c0-ba8d-2ff4f00dcabc',
      name: 'Traditional  Sofa',
      categories: [
        {
          categoryId: 'ae7004cf-69b0-420e-af6c-f235b8c92017',
          descendants: [],
          _url: undefined,
          _urls: {},
        },
      ],
      variants: [
        {
          id: '1',
          sku: 'TLSS-01',
          images: ['https://_ZXpDL48.jpeg'],
          prices: { fractionDigits: 2, centAmount: 359900 },
          isOnStock: true,
          price: { currencyCode: 'USD' },
        },
      ],
      _url: '/traditional--sofa/p/TLSS-01',
    });
  });
});
