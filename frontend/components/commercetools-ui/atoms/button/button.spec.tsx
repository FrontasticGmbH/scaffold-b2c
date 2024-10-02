import { render, screen } from '__test__/utils';
import Button from '.';

describe('[Component] Button', () => {
  it('Renders a button correctly', () => {
    render(<Button>Iam a button</Button>);

    expect(screen.queryByText('Iam a button')).toBeInTheDocument();
  });

  it('Renders loading icon correctly', () => {
    const result = render(<Button loading>Iam a button</Button>);

    expect(screen.queryByTestId('loading-icon')).toBeInTheDocument();
    expect(screen.queryByText('Iam a button')).toBeInTheDocument();

    result.rerender(<Button loading={false}>Iam a button</Button>);

    expect(screen.queryByTestId('loading-icon')).not.toBeInTheDocument();
    expect(screen.queryByText('Iam a button')).toBeInTheDocument();
  });

  it('Renders feedback correctly', () => {
    const result = render(<Button added>Add to cart</Button>);

    expect(screen.queryByTestId('check-icon')).toBeInTheDocument();
    expect(screen.queryByText('Add to cart')).toBeInTheDocument();

    result.rerender(<Button added={false}>Add to cart</Button>);

    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
    expect(screen.queryByText('Add to cart')).toBeInTheDocument();
  });

  it('Renders icons correctly', () => {
    render(<Button icon={<span data-testid="user" />}>Account</Button>);

    expect(screen.queryByTestId('user')).toBeInTheDocument();
    expect(screen.queryByText('Account')).toBeInTheDocument();
  });

  it('Adapts icon position correctly', () => {
    const result = render(
      <Button icon={<span data-testid="user" />} iconPosition="left">
        <span>Account</span>
      </Button>,
    );

    expect(screen.getByTestId('user').nextSibling).toHaveTextContent('Account');

    result.rerender(
      <Button icon={<span data-testid="user" />} iconPosition="right">
        <span>Account</span>
      </Button>,
    );

    expect(screen.getByText('Account').nextSibling).toHaveAttribute('data-testid', 'user');
  });

  it('Renders skeleton correclty', () => {
    render(<Button asSkeleton>Iam a button</Button>);

    expect(screen.queryByTestId('skeleton')).toBeInTheDocument();
  });
});
