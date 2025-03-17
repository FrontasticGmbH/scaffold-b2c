import { render, screen } from '__test__/utils';
import Image from '.';
import { ImageProps } from './types';

/* eslint-disable @next/next/no-img-element */
jest.mock('next-cloudinary', () => ({
  CldImage: (props: ImageProps) => (
    <img
      src={`https://res.cloudinary.com/mock-cloud/image/upload/${props.src}`}
      alt={props.alt}
      title={props.title || undefined}
      width={props.width}
      height={props.height}
      data-testid="cloudinary-image"
    />
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) => (
    <img
      src={`/_next/image?url=${encodeURIComponent(props.src || '')}&w=3840&q=75`}
      alt={props.alt}
      title={props.title || undefined}
      width={props.width}
      height={props.height}
      data-testid="next-image"
    />
  ),
}));

// Mock the default loader

jest.mock(
  './loaders/default/index.ts',
  () =>
    ({ src }: { src: string }) =>
      src,
);

describe('[Component] Image', () => {
  describe('Cloudinary image rendering', () => {
    test('It renders images with media ID using Cloudinary', () => {
      render(<Image media={{ mediaId: 'MEDIA_ID', width: 100 }} alt="IMG" />);

      const imgElement = screen.getByAltText('IMG');

      // Verify it's a Cloudinary URL (only essential parts)
      expect(imgElement).toHaveAttribute('src', expect.stringContaining('cloudinary'));
      expect(imgElement).toHaveAttribute('src', expect.stringContaining('MEDIA_ID'));
    });
  });

  test('It renders image with no media ID correctly using Next Image', () => {
    render(<Image src="/SRC" alt="IMG" />);

    const imgElement = screen.getByAltText('IMG');

    // Verify it's a Next.js optimized image (only essential parts)
    expect(imgElement).toHaveAttribute('src', expect.stringContaining('/_next/image'));
    expect(imgElement).toHaveAttribute('src', expect.stringContaining('SRC'));
  });

  test('It sets width and height correctly for non-fill images', () => {
    render(<Image src="/SRC" width={10} height={10} alt="IMG" />);

    const imgElement = screen.getByAltText('IMG');
    expect(imgElement).toHaveAttribute('width', '10');
    expect(imgElement).toHaveAttribute('height', '10');
  });

  test('It does not set width and height for fill images', () => {
    render(
      <div style={{ position: 'relative', height: '300px' }}>
        <Image src="/SRC" width={10} height={10} fill alt="IMG" />
      </div>,
    );

    const imgElement = screen.getByAltText('IMG');
    expect(imgElement).not.toHaveAttribute('width');
    expect(imgElement).not.toHaveAttribute('height');
  });
});
