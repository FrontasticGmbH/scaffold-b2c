import userEvent from '@testing-library/user-event';
import { act, render, screen } from '__test__/utils';
import WishlistItem from '.';

describe('[Component] Wishlist item', () => {
  it('Renders correctly', () => {
    render(
      <WishlistItem
        item={{
          lineItemId: '',
          name: 'T-Shirt',
          variant: {
            sku: '123',
            images: ['https://cdn.com/path/to/img.png'],
            price: { centAmount: 10000, fractionDigits: 2, currencyCode: 'USD' },
          },
        }}
      />,
    );

    expect(screen.queryByAltText('T-Shirt')).toBeInTheDocument();
    expect(screen.getByAltText('T-Shirt')).toHaveAttribute('src', 'https://cdn.com/path/to/img-small.png');

    expect(screen.queryByText('T-Shirt')).toBeInTheDocument();

    expect(screen.queryByText('US$100.00')).toBeInTheDocument();

    expect(screen.queryByTestId('remove-button')).toBeInTheDocument();

    expect(screen.queryByText('Add to cart')).toBeInTheDocument();
  });

  it('Displays discount correctly', () => {
    render(
      <WishlistItem
        item={{
          lineItemId: '',
          variant: {
            sku: '123',
            price: { centAmount: 10000, fractionDigits: 2, currencyCode: 'USD' },
            discountedPrice: { centAmount: 5000, fractionDigits: 2, currencyCode: 'USD' },
          },
        }}
      />,
    );

    expect(screen.queryByText('US$100.00')).toBeInTheDocument();
    expect(screen.queryByText('US$100.00')).toHaveClass('line-through');

    expect(screen.queryByText('US$50.00')).toBeInTheDocument();
    expect(screen.queryByText('US$50.00')).toHaveClass('text-accent-red');
  });

  it('Can be removed from wishlist', async () => {
    const onRemove = jest.fn();

    render(
      <WishlistItem
        item={{
          lineItemId: '',
          variant: { sku: '123' },
        }}
        onRemove={onRemove}
      />,
    );

    await act(async () => userEvent.click(screen.getByTestId('remove-button')));

    expect(onRemove).toHaveBeenCalled();
  });

  it('Can be moved to cart', async () => {
    const onMoveToCart = jest.fn();

    render(
      <WishlistItem
        item={{
          lineItemId: '',
          variant: { sku: '123', isOnStock: true },
        }}
        onMoveToCart={onMoveToCart}
      />,
    );

    await act(async () => userEvent.click(screen.getByText('Add to cart')));

    expect(onMoveToCart).toHaveBeenCalled();
  });

  it("Can't be moved to cart when not on stock", async () => {
    const onMoveToCart = jest.fn();

    render(
      <WishlistItem
        item={{
          lineItemId: '',
          variant: { sku: '123', isOnStock: false },
        }}
        onMoveToCart={onMoveToCart}
      />,
    );

    expect(screen.getByText('Add to cart')).toHaveAttribute('disabled');

    await act(async () => userEvent.click(screen.getByText('Add to cart')));

    expect(onMoveToCart).not.toHaveBeenCalled();
  });
});
