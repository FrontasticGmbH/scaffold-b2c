import { getTranslations } from './get-translations';

describe('get-translation', () => {
  const namespace = 'common';
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original console.log behavior
  });

  it('Returns correct locale', async () => {
    const locale = 'en-us';
    const result = await getTranslations([locale], [namespace]);
    expect(console.log).toHaveBeenCalledTimes(0);
    expect(result).toEqual(
      expect.objectContaining({
        [locale]: expect.any(Object),
      }),
    );
  });

  it('Returns correct language', async () => {
    const existingLanguage = 'en';
    const result = await getTranslations([existingLanguage], [namespace]);
    expect(console.log).toHaveBeenCalledTimes(0);
    expect(result).toEqual(
      expect.objectContaining({
        [existingLanguage]: expect.any(Object),
      }),
    );
  });

  it('Returns undefined for non existing locale', async () => {
    const locale = 'does-notexist';

    const result = await getTranslations([locale], [namespace]);

    expect(console.log).toHaveBeenCalledWith(
      `Cannot find either translations/${locale}/${namespace}.json or translations/does/${namespace}.json`,
    );
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(result).toEqual(
      expect.objectContaining({
        [locale]: { [namespace]: undefined },
      }),
    );
  });

  it('Returns undefined for non existing language', async () => {
    const language = 'doesnotexist';

    const result = await getTranslations([language], [namespace]);
    expect(console.log).toHaveBeenCalledWith(`Cannot find translations/${language}/${namespace}.json`);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(result).toEqual(
      expect.objectContaining({
        [language]: { [namespace]: undefined },
      }),
    );
  });
});
