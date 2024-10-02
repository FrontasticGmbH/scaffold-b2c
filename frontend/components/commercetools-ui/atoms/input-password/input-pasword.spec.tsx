import { render, screen, fireEvent } from '@testing-library/react';
import PasswordInput from '.';

describe('[Component] Password Input', () => {
  it('Renders as type password by default', () => {
    render(<PasswordInput value="password" />);

    const inputElement = screen.getByDisplayValue<HTMLInputElement>('password');

    expect(inputElement.type).toBe('password');
  });

  it('Toggles visibility when show/hide icon is clicked', () => {
    render(<PasswordInput value="password" />);

    const inputElement = screen.getByDisplayValue<HTMLInputElement>('password');
    const showPasswordButton = screen.getByTestId('show-password-icon');

    expect(inputElement.type).toBe('password');

    fireEvent.click(showPasswordButton);

    expect(inputElement.type).toBe('text');

    const hidePasswordButton = screen.getByTestId('hide-password-icon');

    fireEvent.click(hidePasswordButton);

    expect(inputElement.type).toBe('password');
  });
});
