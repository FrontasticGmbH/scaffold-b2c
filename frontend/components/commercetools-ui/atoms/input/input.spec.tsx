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
    const validate = jest.fn();

    render(<Input onChange={onChange} validation={validate} />);

    await act(async () => userEvent.type(screen.getByRole('textbox'), 'Hello!'));

    expect(onChange).toHaveBeenCalledTimes(6);
    expect(onChange.mock.calls.at(-1)[0].target.value).toBe('Hello!');
    expect(validate).toHaveBeenLastCalledWith('Hello!');
  });

  it('Works with controlled state correctly', async () => {
    const onChange = jest.fn();

    render(<Input onChange={onChange} value="Hello!" />);

    expect(screen.queryByDisplayValue('Hello!')).toBeInTheDocument();

    await act(async () => userEvent.type(screen.getByRole('textbox'), 'Bye!'));

    expect(screen.queryByDisplayValue('Hello!')).toBeInTheDocument();

    for (const call of onChange.mock.calls) expect(call[0].target.value).toBe('Hello!');
  });

  it('Renders valid state correctly', async () => {
    const result = render(<Input isValid />);

    expect(screen.queryByTestId('check-icon')).toBeInTheDocument();

    await act(async () => fireEvent.focus(screen.getByRole('textbox')));

    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();

    result.rerender(<Input isValid hideCheckIcon />);

    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  it('Renders error state correctly', async () => {
    render(<Input error="Error!" />);

    expect(screen.queryByText('Error!')).toBeInTheDocument();
  });

  it('Renders error state after validating correctly', async () => {
    const validate = jest.fn(() => false);

    render(<Input validation={validate} errorMessage="Error!" />);

    await act(async () => userEvent.type(screen.getByRole('textbox'), 'Hello!'));
    await act(async () => fireEvent.blur(screen.getByRole('textbox')));

    expect(screen.queryByText('Error!')).toBeInTheDocument();
  });
});
