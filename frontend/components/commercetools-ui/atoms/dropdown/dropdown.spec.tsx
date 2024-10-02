import userEvent from '@testing-library/user-event';
import { act, render, screen } from '__test__/utils';
import Dropdown from '.';

describe('[Component] Dropdown', () => {
  test('Default Dropdown | renders correctly', async () => {
    render(
      <Dropdown
        label="Label"
        items={[
          { label: 'Item 1', value: '1' },
          { label: 'Item 2', value: '2' },
        ]}
        defaultValue="1"
      />,
    );

    expect(screen.queryByText('Label')).toBeInTheDocument();

    expect(screen.queryByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).toBeInTheDocument();

    expect(screen.queryByDisplayValue('Item 1')).toBeInTheDocument();

    expect(screen.queryByTestId('chevron-down-icon')).toBeInTheDocument();
  });

  test('Default Dropdown | renders required state correctly', () => {
    render(<Dropdown label="Label" required />);

    expect(screen.queryByText('Label *')).toBeInTheDocument();
  });

  test('Default Dropown | selects options correctly', async () => {
    const onChange = jest.fn();

    render(
      <Dropdown
        items={[
          { label: 'Item 1', value: '1' },
          { label: 'Item 2', value: '2' },
        ]}
        onChange={onChange}
      />,
    );

    await act(async () => userEvent.selectOptions(screen.getByRole('combobox'), '1'));

    expect(onChange.mock.calls[0][0].target.value).toBe('1');
    expect(screen.queryByDisplayValue('Item 1')).toBeInTheDocument();

    await act(async () => userEvent.selectOptions(screen.getByRole('combobox'), '2'));

    expect(onChange.mock.calls[0][0].target.value).toBe('2');
    expect(screen.queryByDisplayValue('Item 2')).toBeInTheDocument();
  });

  test('Default Dropdown | adapts controlled state correctly', async () => {
    render(
      <Dropdown
        items={[
          { label: 'Item 1', value: '1' },
          { label: 'Item 2', value: '2' },
        ]}
        value="1"
      />,
    );

    await act(async () => userEvent.selectOptions(screen.getByRole('combobox'), '2'));

    expect(screen.queryByDisplayValue('Item 1')).toBeInTheDocument();
  });

  test('Option Dropdown | renders correctly', async () => {
    render(
      <Dropdown
        label="Label"
        selectOptions={[
          { name: 'Select an option', value: '' },
          { name: 'Item 1', value: '1' },
          { name: 'Item 2', value: '2' },
        ]}
        selectDefaultValue={{ name: 'Select an option', value: '' }}
      />,
    );

    expect(screen.queryByText('Label')).toBeInTheDocument();

    expect(screen.queryByText('Select an option')).toBeInTheDocument();

    await act(async () => userEvent.click(screen.getByRole('button')));

    expect(screen.queryByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).toBeInTheDocument();

    expect(screen.queryByTestId('chevron-down-icon')).toBeInTheDocument();
  });

  test('Option Dropdown | renders required state correctly', () => {
    render(<Dropdown label="Label" required selectOptions={[]} />);

    expect(screen.queryByText('Label *')).toBeInTheDocument();
  });

  test('Option Dropown | selects options correctly', async () => {
    const onChange = jest.fn();

    render(
      <Dropdown
        selectOptions={[
          { name: 'Select an option', value: '' },
          { name: 'Item 1', value: '1' },
          { name: 'Item 2', value: '2' },
        ]}
        selectOnChange={onChange}
      />,
    );

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('Item 1')));

    expect(onChange.mock.calls[0][0].value).toBe('1');
    expect(screen.queryByText('Item 1')).toBeInTheDocument();

    await act(async () => userEvent.click(screen.getByRole('button')));
    await act(async () => userEvent.click(screen.getByText('Item 2')));

    expect(onChange.mock.calls[1][0].value).toBe('2');
    expect(screen.queryByText('Item 2')).toBeInTheDocument();
  });

  test('Options Dropdown | renders error correctly', () => {
    render(<Dropdown error selectOptions={[]} />);

    expect(screen.getByRole('button')).toHaveAttribute('data-test-error', '1');
  });

  test('Custom Dropdown | renders correctly', async () => {
    render(
      <Dropdown customButtonElement={<button>Custom Button</button>}>
        <div>Item 1</div>
        <div>Item 2</div>
      </Dropdown>,
    );

    expect(screen.queryByText('Custom Button')).toBeInTheDocument();

    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument();

    await act(async () => userEvent.click(screen.getByRole('button')));

    expect(screen.queryByText('Item 1')).toBeInTheDocument();
    expect(screen.queryByText('Item 2')).toBeInTheDocument();
  });
});
