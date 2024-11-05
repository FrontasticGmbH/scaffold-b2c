import { resolveReferenceProps, resolveReferenceTarget } from '.';

describe('[Utility] Reference', () => {
  it('Resolves link reference target correctly', () => {
    let result = resolveReferenceTarget({ type: 'link', link: '/path/to/my/link' });

    expect(result).toBe('/path/to/my/link');

    result = resolveReferenceTarget({ type: 'link', link: '', target: '/path/to/my/target' });

    expect(result).toBe('/path/to/my/target');
  });

  it('Resolves page folder reference target correctly', () => {
    const result = resolveReferenceTarget({
      type: 'page-folder',
      pageFolder: {
        pageFolderId: '',
        name: '',
        _urls: {},
        _url: '/path/to/my/url',
      },
    });

    expect(result).toBe('/path/to/my/url');
  });

  it('Resovles reference props correctly', () => {
    let result = resolveReferenceProps({ type: 'link', link: '', openInNewWindow: false });

    expect(result).toEqual({});

    result = resolveReferenceProps({ type: 'link', link: '', openInNewWindow: true });

    expect(result).toEqual({ target: '_blank', rel: 'noopener' });
  });
});
