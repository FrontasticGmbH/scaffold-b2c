import cloudinaryLoader from '.';

describe('[Image Loader] Cloudinary', () => {
  const originalEnv = process.env;

  beforeAll(() => {
    jest.resetModules();

    process.env = { ...originalEnv, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'CLOUD_NAME' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('Generates the correct cloudinary URL with ratio', () => {
    const url = cloudinaryLoader({ mediaId: 'image_id', width: 200, ratio: '16/9', gravity: 'body' });

    expect(url).toBe(
      'https://res.cloudinary.com/CLOUD_NAME/image/upload/f_auto,c_limit,g_body,w_200,q_auto,c_crop,ar_16/9/image_id',
    );
  });

  it('Generates the correct cloudinary URL with no ratio', () => {
    const url = cloudinaryLoader({ mediaId: 'image_id', width: 200 });

    expect(url).toBe('https://res.cloudinary.com/CLOUD_NAME/image/upload/w_200,q_auto,c_scale/image_id');
  });

  it('Generates the correct cloudinary URL with auto gravity', () => {
    const url = cloudinaryLoader({ mediaId: 'image_id', width: 200, ratio: '16/9' });

    expect(url).toBe(
      'https://res.cloudinary.com/CLOUD_NAME/image/upload/f_auto,c_limit,g_auto,w_200,q_auto,c_crop,ar_16/9/image_id',
    );
  });

  it('Generates the correct cloudinary URL with custom gravity', () => {
    const url = cloudinaryLoader({
      mediaId: 'image_id',
      width: 200,
      ratio: '16/9',
      gravity: 'custom',
      x: '20',
      y: '30',
    });

    expect(url).toBe(
      'https://res.cloudinary.com/CLOUD_NAME/image/upload/f_auto,c_limit,g_custom,w_200,q_auto,c_crop,x_20,y_30,ar_16/9/image_id',
    );
  });
});
