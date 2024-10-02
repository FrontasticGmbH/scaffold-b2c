import { render, screen } from '__test__/utils';
import Link from '.';

describe('[Component] Link', () => {
  test('It renders children correctly', () => {
    render(<Link link="">Click Me</Link>);

    expect(screen.getByRole('link').textContent).toBe('Click Me');
  });

  test('It builds absolute href correctly with default locale', () => {
    render(<Link link="/path/to/page" />);

    expect(screen.getByRole('link').getAttribute('href')).toBe('/en/path/to/page');
  });

  test('It builds absolute href correctly with given locale', () => {
    render(<Link link="/path/to/page" locale="de" />);

    expect(screen.getByRole('link').getAttribute('href')).toBe('/de/path/to/page');
  });

  test('It builds full href correctly', () => {
    render(<Link link="https://example.com/path/to/page" />);

    expect(screen.getByRole('link').getAttribute('href')).toBe('https://example.com/path/to/page');
  });

  test('It builds relative href correctly', () => {
    render(<Link link="path/to/page" />);

    expect(screen.getByRole('link').getAttribute('href')).toBe('path/to/page');
  });

  test('It builds query params only href correctly', () => {
    render(<Link link="?a=b&c=d" />);

    expect(screen.getByRole('link').getAttribute('href')).toBe('?a=b&c=d');
  });
});
