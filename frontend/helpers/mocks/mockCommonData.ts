import { ShipmentState } from 'shared/types/cart';
import { LineItem } from 'shared/types/cart/LineItem';
import { Order } from 'shared/types/cart/Order';
import { ShippingMethod } from 'shared/types/cart/ShippingMethod';
import { Product } from 'shared/types/product/Product';
import { Reference } from 'types/reference';

export const linkReferenceOne: Reference = {
  link: '/',
  openInNewWindow: false,
  type: 'link',
};

export const linkReferenceTwo: Reference = {
  type: 'page-folder',
  pageFolder: {
    pageFolderId: 'b27378fbe05639798e9b23399a373bc0',
    name: 'Link',
    _urls: { de_CH: '/men', fr_CH: '/men', it_CH: '/men', de_LI: '/men' },
    _url: '/men',
  },
  openInNewWindow: false,
};

export const lineItems: LineItem[] = [
  {
    lineItemId: '2234-3333-0001',
    count: 3,
    name: 'Item number 1',
    price: {
      centAmount: 9999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },
    //taxedPrice: {},
    variant: {
      id: '1',
      sku: 'GRCG-01',
      images: [
        'https://images.cdn.europe-west1.gcp.commercetools.com/a79de97d-1218-4218-a80f-29109baae7b0/sample-data_goodstor-rFyoxXme.jpeg',
      ],
      attributes: {
        productspec: '- Set of 5 glasses\n- Imported crystal\n- Gold polish on the rims',
      },
      price: {
        fractionDigits: 2,
        centAmount: 2799,
        currencyCode: 'USD',
      },
    },
  },
  {
    lineItemId: '2234-3333-0002',
    count: 3,
    name: 'Item number 2',
    price: {
      centAmount: 9999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },
    //taxedPrice: {},
    variant: {
      id: '1',
      sku: 'GPC-01',
      images: [
        'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_393014656-_k6QZQka.jpeg',
        'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_428905072-yDh7ZXzp.jpeg',
      ],
      attributes: {
        color: 'silver',
        colorlabel: 'Silver',
        productspec:
          '- Velvet fabric\n- Cotton lining\n- Pillow case comes with zip for easy removal\n- Pillow not included\n- Washable',
      },
      price: {
        fractionDigits: 2,
        centAmount: 1999,
        currencyCode: 'USD',
      },
      isOnStock: true,
    },
  },
  {
    lineItemId: '2234-3333-0003',
    count: 3,
    name: 'Item number 3',
    price: {
      centAmount: 9999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },
    //taxedPrice: {},
    variant: {
      id: '1',
      sku: 'TTSS-01',
      images: [
        'https://95dfeffbda96db953574-a645c2420e466d4e59dabbadeebf9a9e.ssl.cf3.rackcdn.com/AdobeStock_305670594-Svpdrrw1.jpeg',
        'https://95dfeffbda96db953574-a645c2420e466d4e59dabbadeebf9a9e.ssl.cf3.rackcdn.com/AdobeStock_305670456-7LLjHhlw.jpeg',
        'https://95dfeffbda96db953574-a645c2420e466d4e59dabbadeebf9a9e.ssl.cf3.rackcdn.com/AdobeStock_305671593-0TIoFOzl.jpeg',
      ],
      attributes: {
        productspec: '- Three seater sofa\n- Velvet upholstery\n- Assembly on site',
        color: '#09331c',
        colorlabel: 'Emerald',
        finish: '#202120',
        finishlabel: 'Espresso',
      },
      price: {
        fractionDigits: 2,
        centAmount: 239900,
        currencyCode: 'USD',
      },
      discountedPrice: {
        fractionDigits: 2,
        centAmount: 215910,
        currencyCode: 'USD',
      },
      isOnStock: true,
    },
  },
  {
    lineItemId: '2234-3333-0004',
    count: 3,
    name: 'Item number 4',
    price: {
      centAmount: 9999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },
    //taxedPrice: {},
    variant: {
      id: '1',
      sku: 'ALC-01',
      images: [
        'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_378975371-myB5QCrw.jpeg',
      ],
      attributes: {
        color: 'lightpink',
        colorlabel: 'Soft Pink',
        finishlabel: 'Brass',
        finish: 'goldenrod',
        productspec: '- Comes with matching throw pillow\n- Velvet upholstery\n- Pre-assembled',
      },
      price: {
        fractionDigits: 2,
        centAmount: 75000,
        currencyCode: 'USD',
      },
      isOnStock: true,
    },
  },
  {
    lineItemId: '2234-3333-0005',
    count: 3,
    name: 'Item number 5',
    price: {
      centAmount: 9999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },
    //taxedPrice: {},
    variant: {
      id: '1',
      sku: 'MMST-01',
      images: [
        'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_308570068-ftaFzBEg.jpeg',
        'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_314247429-Qt_DKygA.jpeg',
      ],
      attributes: {
        color: 'white',
        colorlabel: 'White',
        finish: 'white',
        finishlabel: 'Marble',
        productspec: '- 4 legged side table\n- Walnut legs\n- Pre-assembled',
      },
      price: {
        fractionDigits: 2,
        centAmount: 12000,
        currencyCode: 'USD',
      },
      isOnStock: true,
    },
  },
];

export const products: Product[] = [
  {
    name: 'Product 1',
    variants: [
      {
        id: '1',
        sku: 'MMST-01',
        images: [
          'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_308570068-ftaFzBEg.jpeg',
          'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_314247429-Qt_DKygA.jpeg',
        ],
        attributes: {
          color: 'white',
          colorlabel: 'White',
          finish: 'white',
          finishlabel: 'Marble',
          productspec: '- 4 legged side table\n- Walnut legs\n- Pre-assembled',
        },
        price: {
          fractionDigits: 2,
          centAmount: 12000,
          currencyCode: 'USD',
        },
        isOnStock: true,
      },
      {
        id: '2',
        sku: 'MMST-02',
        images: [
          'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_308570077-dEUwL6Ta.jpeg',
        ],
        attributes: {
          finishlabel: 'Walnut',
          color: '#d69169',
          colorlabel: 'Golden Pecan',
          finish: '#d69169',
          productspec: '- 4 legged side table\n- Walnut legs\n- Pre-assembled',
        },
        price: {
          fractionDigits: 2,
          centAmount: 4999,
          currencyCode: 'USD',
        },
        isOnStock: true,
      },
    ],
  },
  {
    name: 'Product 2',
    variants: [
      {
        id: '1',
        sku: 'ALC-01',
        images: [
          'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_378975371-myB5QCrw.jpeg',
        ],
        attributes: {
          color: 'lightpink',
          colorlabel: 'Soft Pink',
          finishlabel: 'Brass',
          finish: 'goldenrod',
          productspec: '- Comes with matching throw pillow\n- Velvet upholstery\n- Pre-assembled',
        },
        price: {
          fractionDigits: 2,
          centAmount: 75000,
          currencyCode: 'USD',
        },
        isOnStock: true,
      },
    ],
  },
  {
    name: 'Product 3',
    variants: [
      {
        id: '1',
        sku: 'TTSS-01',
        images: [
          'https://95dfeffbda96db953574-a645c2420e466d4e59dabbadeebf9a9e.ssl.cf3.rackcdn.com/AdobeStock_305670594-Svpdrrw1.jpeg',
          'https://95dfeffbda96db953574-a645c2420e466d4e59dabbadeebf9a9e.ssl.cf3.rackcdn.com/AdobeStock_305670456-7LLjHhlw.jpeg',
          'https://95dfeffbda96db953574-a645c2420e466d4e59dabbadeebf9a9e.ssl.cf3.rackcdn.com/AdobeStock_305671593-0TIoFOzl.jpeg',
        ],
        attributes: {
          productspec: '- Three seater sofa\n- Velvet upholstery\n- Assembly on site',
          color: '#09331c',
          colorlabel: 'Emerald',
          finish: '#202120',
          finishlabel: 'Espresso',
        },
        price: {
          fractionDigits: 2,
          centAmount: 239900,
          currencyCode: 'USD',
        },
        discountedPrice: {
          fractionDigits: 2,
          centAmount: 215910,
          currencyCode: 'USD',
        },
        isOnStock: true,
      },
    ],
  },
  {
    name: 'Product 4',
    variants: [
      {
        id: '1',
        sku: 'GPC-01',
        images: [
          'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_393014656-_k6QZQka.jpeg',
          'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_428905072-yDh7ZXzp.jpeg',
        ],
        attributes: {
          color: 'silver',
          colorlabel: 'Silver',
          productspec:
            '- Velvet fabric\n- Cotton lining\n- Pillow case comes with zip for easy removal\n- Pillow not included\n- Washable',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1999,
          currencyCode: 'USD',
        },
        isOnStock: true,
      },
      {
        id: '2',
        sku: 'GPC-02',
        images: [
          'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_428905591-cqjZDCoa.jpeg',
          'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_428905072-jCMMBAQN.jpeg',
        ],
        attributes: {
          color: 'lightpink',
          colorlabel: 'Salmon Gold',
          productspec:
            '- Velvet fabric\n- Cotton lining\n- Pillow case comes with zip for easy removal\n- Pillow not included\n- Washable',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1999,
          currencyCode: 'USD',
        },
        isOnStock: true,
      },
      {
        id: '3',
        sku: 'GPC-03',
        images: [
          'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_428905063-7BiCdYkA.jpeg',
          'https://2eca75039cf911b9bbe5-79bfd3e36f011d786971804e873c4354.ssl.cf3.rackcdn.com/AdobeStock_428905072-f5lSi4ra.jpeg',
        ],
        attributes: {
          color: 'tan',
          colorlabel: 'Ivory Tan',
          productspec:
            '- Velvet fabric\n- Cotton lining\n- Pillow case comes with zip for easy removal\n- Pillow not included\n- Washable',
        },
        price: {
          fractionDigits: 2,
          centAmount: 1999,
          currencyCode: 'USD',
        },
        isOnStock: true,
      },
    ],
  },
  {
    name: 'Product 5',
    variants: [
      {
        id: '1',
        sku: 'GRCG-01',
        images: [
          'https://images.cdn.europe-west1.gcp.commercetools.com/a79de97d-1218-4218-a80f-29109baae7b0/sample-data_goodstor-rFyoxXme.jpeg',
        ],
        attributes: {
          productspec: '- Set of 5 glasses\n- Imported crystal\n- Gold polish on the rims',
        },
        price: {
          fractionDigits: 2,
          centAmount: 2799,
          currencyCode: 'USD',
        },
      },
    ],
  },
];

export const shippingMethods: ShippingMethod[] = [
  {
    shippingMethodId: 'method-01',
    name: 'UPS',
    description: 'Shipping method description',
  },
];
export const orders: Order[] = [
  {
    email: 'spider.man@gmail.com',
    cartId: '0000001',
    orderId: 'ORD-00000001',
    orderState: 'Open',
    /*subtotal: {
      centAmount: 99999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },*/
    availableShippingMethods: [
      {
        shippingMethodId: 'method-01',
        name: 'UPS',
        description: 'Shipping method description',
      },
    ],

    shippingAddress: {
      addressId: 'ADDR-00001',
      city: 'Berlin',
      country: 'Germany',
      firstName: 'Peter Parker',
      lastName: 'Parker',
      postalCode: '42069',
      streetName: 'Alexander Platz',
      phone: '+555 556955555',
      isDefaultShippingAddress: true,
      isDefaultBillingAddress: true,
      streetNumber: 'st.47',
    },
    shippingInfo: {
      shippingMethodId: 'method-01',
      name: 'UPS',
      description: 'Shipping method description',
      price: {
        centAmount: 9999,
        currencyCode: 'EUR',
        fractionDigits: 2,
      },
    },
    shipmentState: 'Shipped' as ShipmentState,
    sum: {
      centAmount: 99999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },
    payments: [
      {
        //cardSummary: '0420',
        paymentId: 'payment-01',
        id: '000001',
        paymentProvider: 'VISA',
        paymentMethod: 'VISA',
        amountPlanned: {
          centAmount: 99999,
          currencyCode: 'EUR',
          fractionDigits: 2,
        },
        paymentStatus: 'PAID',
      },
    ],

    lineItems: lineItems,
  },
];
