import { render, screen } from '__test__/utils';
import Tile from '.';

describe('[Component] Tile', () => {
  it('Renders image correctly', () => {
    render(<Tile title="my_title" subtitle="" image={{ src: '/path/to/image', unoptimized: true }} />);

    expect(screen.queryByAltText('my_title')).toBeInTheDocument();
    expect(screen.getByAltText('my_title')).toHaveAttribute('src', '/path/to/image');
  });

  it('Renders title correctly', () => {
    render(<Tile title="my_title" subtitle="" />);

    expect(screen.queryByText('my_title')).toBeInTheDocument();
  });

  it('Renders subtitle correctly', () => {
    render(<Tile title="" subtitle="my_subtitle" />);

    expect(screen.queryByText('my_subtitle')).toBeInTheDocument();
  });

  it('Renders CTA correctly', () => {
    const result = render(
      <Tile
        title=""
        subtitle=""
        ctaLabel="CTA"
        ctaReference={{ type: 'link', link: '/path/to/page', openInNewWindow: false }}
      />,
    );

    expect(screen.queryByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/path/to/page');
    expect(screen.getByRole('link')).not.toHaveAttribute('target');

    result.rerender(
      <Tile
        title=""
        subtitle=""
        ctaLabel="CTA"
        ctaReference={{
          type: 'page-folder',
          pageFolder: { pageFolderId: '', name: '', _urls: {}, _url: '/path/to/page' },
          openInNewWindow: true,
        }}
      />,
    );

    expect(screen.queryByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/path/to/page');
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });
});
