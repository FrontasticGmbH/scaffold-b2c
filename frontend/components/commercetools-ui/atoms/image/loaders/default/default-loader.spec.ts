import defaultLoader from '.';

describe('[Image Loader] Default', () => {
  it('Generates image url correctly', () => {
    const url = defaultLoader({ src: 'https://example.com/image.png' });

    expect(url).toBe('https://example.com/image.png');
  });

  it('Generates image url with suffix correctly', () => {
    const url = defaultLoader({ src: 'https://example.com/image.png', suffix: 'large' });

    expect(url).toBe('https://example.com/image-large.png');
  });
});
