import { render, screen } from '__test__/utils';
import Typography from '.';

describe('[Component] Typography', () => {
  it('Renders content correctly', () => {
    const result = render(<Typography>Hello!</Typography>);

    expect(result.baseElement.querySelector('p')).toBeInTheDocument();
    expect(result.baseElement.querySelector('p')?.textContent).toBe('Hello!');
  });

  it('Renders localized content correctly', () => {
    const result = render(<Typography>{{ en: 'Hello!' }}</Typography>);

    expect(result.baseElement.querySelector('p')).toBeInTheDocument();
    expect(result.baseElement.querySelector('p')?.textContent).toBe('Hello!');
  });

  it('Renders given element correctly', () => {
    const result = render(<Typography as="h1">Hello!</Typography>);

    expect(result.baseElement.querySelector('h1')).toBeInTheDocument();
    expect(result.baseElement.querySelector('h1')?.textContent).toBe('Hello!');

    result.rerender(<Typography as="fragment">Hello!</Typography>);

    expect(result.baseElement.innerHTML).toBe('<div>Hello!</div>');
  });

  it('Renders skeleton correctly', () => {
    render(<Typography asSkeleton>Hello!</Typography>);

    expect(screen.queryByTestId('skeleton')).toBeInTheDocument();
  });
});
