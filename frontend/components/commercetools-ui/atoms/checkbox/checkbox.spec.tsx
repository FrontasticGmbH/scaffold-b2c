import userEvent from '@testing-library/user-event';
import { act, render, screen } from '__test__/utils';
import Checkbox from '.';

describe('[Component] Checkbox', () => {
  it('Renders label correctly', () => {
    render(<Checkbox label="Label" />);

    expect(screen.getByLabelText('Label')).toBeDefined();
  });

  it('Checks and unchecks correctly', async () => {
    render(<Checkbox />);

    await act(async () => userEvent.click(screen.getByRole('checkbox')));

    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBeTruthy();
  });

  it('Can be default checked', () => {
    render(<Checkbox defaultChecked />);

    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBeTruthy();
  });

  it('Works in the controlled state correctly', async () => {
    render(<Checkbox checked={false} />);

    await act(async () => userEvent.click(screen.getByRole('checkbox')));

    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBeFalsy();
  });

  it('Works in the disabled state correctly', async () => {
    render(<Checkbox disabled />);

    await act(async () => userEvent.click(screen.getByRole('checkbox')));

    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBeFalsy();
  });
});
