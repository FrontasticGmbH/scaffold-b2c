import { act } from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '__test__/utils';
import Search from '.';

const router = { push: jest.fn() };

jest.mock('next/navigation', () => ({ useRouter: () => router, useParams: () => ({ locale: 'en' }) }));

describe('[Component] Search', () => {
  test('It renders and behaves correctly', async () => {
    const onQueryUpdate = jest.fn();

    render(
      <Search
        items={Array.from({ length: 7 }).map((_, i) => ({
          productId: `${i + 1}`,
          name: `Item ${i + 1}`,
          _url: 'item_url',
          variants: [],
        }))}
        categories={[]}
        onQueryUpdate={onQueryUpdate}
      />,
    );

    expect(document.body.style.overflowY).not.toBe('hidden');

    expect(screen.queryByTestId('search-panel')).not.toBeInTheDocument();
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(screen.queryByTestId('submit-button')).toBeInTheDocument();

    await act(async () => await userEvent.type(screen.getByRole('textbox'), 'I'));

    expect(document.body.style.overflowY).toBe('hidden');

    expect(onQueryUpdate).toHaveBeenCalledWith('I');

    expect(screen.queryByTestId('reset-button')).toBeInTheDocument();
    expect(screen.queryByTestId('search-panel')).toBeVisible();
    expect(screen.queryByTestId('overlay')).toBeVisible();

    Array.from({ length: 6 }).forEach((_, i) => expect(screen.queryByText(`Item ${i + 1}`)).toBeVisible());

    expect(screen.queryByText('Item 7')).not.toBeInTheDocument();
  });

  test('It submits correctly', async () => {
    render(<Search items={[]} categories={[]} />);

    await act(async () => await userEvent.click(screen.getByTestId('submit-button')));

    expect(router.push).not.toHaveBeenCalled();

    await act(async () => await userEvent.type(screen.getByRole('textbox'), 'I'));

    expect(document.activeElement).toBe(screen.getByRole('textbox'));

    await act(async () => await userEvent.click(screen.getByTestId('submit-button')));

    expect(router.push).toHaveBeenCalledWith('/search?query=I');
    expect(document.activeElement).not.toBe(screen.getByRole('textbox'));
  });

  test('It resets correctly', async () => {
    const onQueryUpdate = jest.fn();

    render(<Search items={[]} categories={[]} onQueryUpdate={onQueryUpdate} />);

    await act(async () => await userEvent.type(screen.getByRole('textbox'), 'I'));

    await act(async () => await userEvent.click(screen.getByTestId('reset-button')));

    expect(onQueryUpdate).toHaveBeenCalledWith('');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
  });

  test('Search item renders and behaves as expected', async () => {
    render(
      <Search
        items={[
          {
            productId: '1',
            name: 'Item 1',
            _url: 'item_url',
            variants: [],
            categories: [{ categoryId: '1' }],
          },
        ]}
        categories={[{ categoryId: '1', name: 'CATEGORY' }]}
      />,
    );

    await act(async () => await userEvent.type(screen.getByRole('textbox'), 'I'));

    expect(screen.queryByText('Item 1')).toBeVisible();
    expect(screen.queryByText('CATEGORY')).toBeVisible();
    expect(screen.queryByRole('link')).toHaveAttribute('href', 'item_url');

    await act(async () => await userEvent.click(screen.getByRole('link')));

    expect(router.push).toHaveBeenCalledWith('item_url');
  });
});
