import { act, fireEvent, render, screen } from '@testing-library/react';
import toast from 'react-hot-toast';
import Toaster from '.';
import Button from '../button';

describe('[Component] Toaster', () => {
  afterEach(async () => {
    await act(async () => toast.remove());
  });

  it('Renders Toaster after the trigger', () => {
    render(
      <div>
        <Button onClick={() => toast.success("I'm a toaster")}>Show toaster</Button>
        <Toaster />
      </div>,
    );

    // Ensure the toast is not present initially
    expect(screen.queryByText("I'm a toaster")).toBeNull();

    // Trigger the toast
    fireEvent.click(screen.getByRole('button'));

    // Verify the toast appears
    expect(screen.getByText("I'm a toaster")).toBeInTheDocument();
  });

  it('Renders multiple toasts', () => {
    render(
      <div>
        <Button
          onClick={() => {
            toast.success('Toast 1');
            toast.success('Toast 2');
          }}
        >
          Show toasts
        </Button>
        <Toaster />
      </div>,
    );

    // Trigger the toasts
    fireEvent.click(screen.getByRole('button'));

    // Verify both toasts appear
    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
  });

  it('Renders success and error toast types', () => {
    render(
      <div>
        <Button
          onClick={() => {
            toast.success('Success toast');
            toast.error('Error toast');
          }}
        >
          Show different toasts
        </Button>
        <Toaster />
      </div>,
    );

    // Trigger the toasts
    fireEvent.click(screen.getByRole('button'));

    // Verify all different types of toasts appear
    expect(screen.getByText('Success toast')).toBeInTheDocument();
    expect(screen.getByText('Error toast')).toBeInTheDocument();
  });
});
