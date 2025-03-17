import userEvent from '@testing-library/user-event';
import { act, render, screen } from '__test__/utils';
import ProductTile, { ProductTileProps } from '.';

jest.mock('context/add-to-cart-overlay', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-add-to-cart-overlay">{children}</div>
  ),
  useAddToCartOverlay: jest.fn(() => ({
    show: jest.fn(),
    hide: jest.fn(),
    fetchRelatedProducts: jest.fn(),
  })),
}));

describe('[Component] Product tile', () => {
  const renderProductTile = (props: Partial<ProductTileProps>) => {
    return render(
      <ProductTile
        product={{
          name: 'T-Shirt',
          variants: [
            {
              sku: '123',
              images: ['https://cdn.com/path/to/img.png'],
              price: { centAmount: 10000, fractionDigits: 2, currencyCode: 'USD' },
              isOnStock: true,
            },
          ],
          _url: 'product-slug/T-Shirt',
        }}
        {...props}
      />,
    );
  };

  it('Renders tile correctly', () => {
    renderProductTile({});

    expect(screen.queryAllByRole('link').length).toBe(2);
    screen.getAllByRole('link').forEach((link) => expect(link).toHaveAttribute('href', '/en/T-Shirt/p/123'));

    const productImage = screen.getByAltText('T-Shirt');
    expect(productImage).toBeInTheDocument();
    expect(productImage).toHaveAttribute('src', expect.stringContaining('/_next/image'));
    expect(productImage).toHaveAttribute('src', expect.stringContaining('cdn.com'));

    expect(screen.queryByText('T-Shirt')).toBeInTheDocument();

    expect(screen.queryByTestId('heart-icon')).toBeInTheDocument();

    expect(screen.queryAllByTestId('product-variant').length).toBe(1);

    expect(screen.queryByText('$100.00')).toBeInTheDocument();
  });

  it('Has quick view functionality working correctly', async () => {
    renderProductTile({});

    expect(screen.queryByText('More details')).toBeNull();

    userEvent.click(screen.getByText('Quick view'));

    expect(await screen.findByText('More details')).toBeInTheDocument();
  });

  it('Can disable Quick View functionality correctly', async () => {
    renderProductTile({ disableQuickView: true });

    expect(screen.queryByText('Quick view')).not.toBeInTheDocument();

    await act(async () => userEvent.hover(screen.getByTestId('image-container')));

    expect(screen.queryByText('Quick view')).not.toBeInTheDocument();
  });

  it('Shows discount correctly', () => {
    renderProductTile({
      product: {
        variants: [
          {
            sku: '123',
            price: { centAmount: 10000, fractionDigits: 2, currencyCode: 'USD' },
            discountedPrice: {
              value: { centAmount: 5000, fractionDigits: 2, currencyCode: 'USD' },
              discount: {
                discountValue: { type: 'relative', value: 50 },
              },
            },
          },
        ],
      },
    });

    expect(screen.queryByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toHaveClass('line-through');

    expect(screen.queryByText('$50.00')).toBeInTheDocument();

    expect(screen.queryByText('50%')).toBeInTheDocument();
  });

  it('Shows stock correctly', () => {
    const { unmount } = renderProductTile({
      product: {
        variants: [{ sku: '123', isOnStock: true, price: { centAmount: 10000 } }],
      },
    });

    expect(screen.queryByText('Sold out')).not.toBeInTheDocument();

    unmount();

    renderProductTile({
      product: {
        variants: [{ sku: '123', isOnStock: false, price: { centAmount: 10000 } }],
      },
    });

    expect(screen.queryByText('Sold out')).toBeInTheDocument();
  });

  it('Displays the correct variant given', () => {
    renderProductTile({
      product: {
        variants: [
          {
            sku: '123',
            isOnStock: true,
            price: { centAmount: 10000, fractionDigits: 2, currencyCode: 'USD' },
            attributes: { color: 'red' },
          },
          {
            sku: '456',
            isOnStock: false,
            price: { centAmount: 5000, fractionDigits: 2, currencyCode: 'USD' },
            attributes: { color: 'blue' },
          },
        ],
      },
      selectedVariantIndex: 1,
    });

    expect(screen.getAllByTestId('product-variant').length).toBe(2);
    expect(screen.queryByText('Sold out')).toBeInTheDocument();
    expect(screen.queryByText('$100.00')).not.toBeInTheDocument();
    expect(screen.queryByText('$50.00')).toBeInTheDocument();
  });

  it('Switches between variants correctly', async () => {
    renderProductTile({
      product: {
        variants: [
          {
            sku: '123',
            isOnStock: true,
            price: { centAmount: 10000, fractionDigits: 2, currencyCode: 'USD' },
            attributes: { color: 'red' },
          },
          {
            sku: '456',
            isOnStock: false,
            price: { centAmount: 5000, fractionDigits: 2, currencyCode: 'USD' },
            attributes: { color: 'blue' },
          },
        ],
      },
    });

    expect(screen.queryByText('Sold out')).not.toBeInTheDocument();
    expect(screen.queryByText('$100.00')).toBeInTheDocument();
    expect(screen.queryByText('$50.00')).not.toBeInTheDocument();

    await act(async () => userEvent.click(screen.getAllByTestId('product-variant')[1]));

    expect(screen.queryByText('Sold out')).toBeInTheDocument();
    expect(screen.queryByText('$100.00')).not.toBeInTheDocument();
    expect(screen.queryByText('$50.00')).toBeInTheDocument();
  });

  it('Hides duplicate variants with respect to their colors', () => {
    renderProductTile({
      product: {
        variants: [
          {
            sku: '123',
            isOnStock: true,
            price: { centAmount: 10000, fractionDigits: 2, currencyCode: 'USD' },
            attributes: { color: 'red' },
          },
          {
            sku: '456',
            isOnStock: false,
            price: { centAmount: 5000, fractionDigits: 2, currencyCode: 'USD' },
            attributes: { color: 'red' },
          },
        ],
      },
    });

    expect(screen.getAllByTestId('product-variant').length).toBe(1);
  });

  it('Can hide variants', () => {
    renderProductTile({
      product: {
        name: 'T-Shirt',
        variants: [
          {
            sku: '123',
            isOnStock: true,
            price: { centAmount: 10000 },
            // Intentionally not providing images to test component resilience
          },
        ],
        _url: 'product-slug/T-Shirt',
      },
      disableVariants: true,
    });

    expect(screen.queryAllByTestId('product-variant').length).toBe(0);

    // Verify the image is still rendered with a placeholder
    expect(screen.getByAltText('T-Shirt')).toBeInTheDocument();
  });

  it('Can hide wishlist button', () => {
    renderProductTile({ disableWishlistButton: true });

    expect(screen.queryByTestId('heart-icon')).not.toBeInTheDocument();
  });

  it('Adds to cart correctly', async () => {
    const onAddToCart = jest.fn();

    renderProductTile({ onAddToCart });

    await act(async () => userEvent.click(screen.getByText('Quick view')));

    await act(async () => userEvent.click(screen.getByText('Add to cart')));

    expect(onAddToCart).toHaveBeenCalled();
  });

  it('Adds to wishlist correctly', async () => {
    const addToWishlist = jest.fn();

    renderProductTile({ addToWishlist, wishlist: { wishlistId: '', lineItems: [] } });

    await act(async () => userEvent.click(screen.getByTestId('heart-icon')));

    expect(addToWishlist).toHaveBeenCalled();
  });

  it('Removes from wishlist correctly', async () => {
    const removeLineItem = jest.fn();

    renderProductTile({
      removeLineItem,
      wishlist: { wishlistId: '', lineItems: [{ lineItemId: '', variant: { sku: '123' } }] },
    });

    expect(screen.getByTestId('heart-icon')).toHaveClass('fill-red-500');

    await act(async () => userEvent.click(screen.getByTestId('heart-icon')));

    expect(removeLineItem).toHaveBeenCalled();
  });
});
