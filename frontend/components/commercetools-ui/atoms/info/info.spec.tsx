import userEvent from '@testing-library/user-event';
import { act, render, screen } from '__test__/utils';
import Info from '.';

describe('[Component] Info', () => {
  test('It renders and toggles correctly', async () => {
    render(<Info message="Hello!" />);

    expect(screen.queryByText('Hello!')).toBeNull();

    await act(async () => await userEvent.hover(screen.getByTestId('info-icon')));

    expect(screen.queryByText('Hello!')).toBeVisible();
  });
});
