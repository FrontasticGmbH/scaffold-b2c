import userEvent from '@testing-library/user-event';
import { act, fireEvent, render, screen } from '__test__/utils';
import Input from '.';

describe('[Component] Input', () => {
  it('Renders correctly', () => {
    render(<Input label="Label" labelDesc="Label Desc" required defaultValue="Hello!" />);

    expect(screen.queryByText('Label *')).toBeInTheDocument();
    expect(screen.queryByText('(Label Desc)')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Hello!')).toBeInTheDocument();
  });

  it('Changes value while validating correctly', async () => {
    const onChange = jest.fn();

    render(<Input onChange={onChange} />);

    await act(async () => userEvent.type(screen.getByRole('textbox'), 'Hello!'));

    expect(onChange).toHaveBeenCalledTimes(6);
    expect(onChange.mock.calls.at(-1)[0].target.value).toBe('Hello!');
  });

  it('Renders valid state correctly', async () => {
    const result = render(<Input error="" isDirty />);

    expect(screen.queryByTestId('check-icon')).toBeInTheDocument();

    await act(async () => fireEvent.focus(screen.getByRole('textbox')));

    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();

    result.rerender(<Input error="" isDirty hideCheckIcon />);

    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  it('Renders error state correctly', async () => {
    render(<Input error="Error!" />);

    expect(screen.queryByText('Error!')).toBeInTheDocument();
  });
});
