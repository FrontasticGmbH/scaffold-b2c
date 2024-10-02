import { render, screen } from '__test__/utils';
import Image from '.';

jest.mock(
  './loaders/cloudinary/index.ts',
  () =>
    ({ mediaId }: { mediaId: string }) =>
      `${mediaId}?w=10`,
);

jest.mock(
  './loaders/default/index.ts',
  () =>
    ({ src }: { src: string }) =>
      src,
);

describe('[Component] Image', () => {
  test('It renders images with media ID correctly', () => {
    render(<Image media={{ mediaId: 'MEDIA_ID', width: 10 }} src="SRC" alt="IMG" />);

    expect(screen.getByAltText('IMG').getAttribute('src')).toBe('MEDIA_ID?w=10');
  });

  test('It renders image with no media ID correctly', () => {
    render(<Image src="SRC" alt="IMG" />);

    expect(screen.getByAltText('IMG').getAttribute('src')).toBe('SRC');
  });

  test('It sets width and height correctly for non-fill images', () => {
    render(<Image src="SRC" width={10} height={10} alt="IMG" />);

    expect(screen.getByAltText('IMG').getAttribute('width')).toBe('10');
    expect(screen.getByAltText('IMG').getAttribute('height')).toBe('10');
  });

  test('It does not set width and height correctly for fill images', () => {
    render(
      <div style={{ position: 'relative', height: '300px' }}>
        <Image src="SRC" width={10} height={10} fill alt="IMG" />
      </div>,
    );

    expect(screen.getByAltText('IMG').getAttribute('width')).toBeNull();
    expect(screen.getByAltText('IMG').getAttribute('height')).toBeNull();
  });
});
