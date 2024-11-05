import { render, screen } from '__test__/utils';
import Subtitle from '.';

describe('[Component] Subtitle', () => {
  it('Renders correctly', () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    render(<Subtitle subtitle="Subtitle!" className="custom-class" />);

    expect(screen.queryByText('Subtitle!')).toBeInTheDocument();
    expect(screen.getByText('Subtitle!')).toHaveClass('custom-class');
  });

  it('Applies correct variant', () => {
    const result = render(<Subtitle subtitle="Subtitle!" variant="sm" />);

    expect(screen.getByText('Subtitle!')).toHaveClass('text-12', 'lg:text-14');

    result.rerender(<Subtitle subtitle="Subtitle!" variant="lg" />);

    expect(screen.getByText('Subtitle!')).toHaveClass('text-14', 'lg:text-16');
  });
});
