import userEvent from '@testing-library/user-event';
import { act, render, screen } from '__test__/utils';
import Radio from '.';

describe('[Component] Radio', () => {
  it('Renders correctly', () => {
    const result = render(<Radio>Label</Radio>);

    expect(result.baseElement.querySelector('label')?.textContent).toBe('Label');
    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(false);
  });

  it('Adapts default checked correctly', () => {
    render(<Radio defaultChecked />);

    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(true);
  });

  it('Functions correctly', async () => {
    const onChange = jest.fn();
    const onChecked = jest.fn();

    const result = render(<Radio onChange={onChange} onChecked={onChecked} />);

    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(false);

    await act(async () => userEvent.click(result.baseElement.querySelector('label') as HTMLLabelElement));

    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(true);

    expect(onChange.mock.calls[0][0].target.checked).toBe(true);
    expect(onChecked).toHaveBeenCalled();
  });

  it('Functions within controlled state correctly', async () => {
    const result = render(<Radio checked={false} />);

    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(false);

    await act(async () => userEvent.click(result.baseElement.querySelector('label') as HTMLLabelElement));

    expect((screen.getByRole('radio') as HTMLInputElement).checked).toBe(false);
  });
});
