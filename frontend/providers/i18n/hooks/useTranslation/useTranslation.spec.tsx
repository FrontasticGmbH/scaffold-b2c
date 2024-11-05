import { RenderHookResult, renderHook } from '__test__/utils';
import useTranslation from '.';
import I18nProvider from '../..';

describe('[Hook] useTranslation', () => {
  let hook: RenderHookResult<ReturnType<typeof useTranslation>, unknown>;
  const translations = { en: { common: { hi: 'hi', welcome: 'Welcome {name}' } } };

  beforeAll(() => {
    hook = renderHook(useTranslation, {
      wrapper: ({ children }) => <I18nProvider translations={translations}>{children}</I18nProvider>,
    });
  });

  it('Returns message correctly if token is valid', () => {
    const { translate } = hook.result.current;

    const message = translate('common.hi');

    expect(message).toBe('hi');
  });

  it('Returns correct fallback message when invalid token is supplied', () => {
    const { translate } = hook.result.current;

    const message = translate('hi');
    const messageWithDefault = translate('hi', { defaultMessage: 'Hello' });

    expect(message).toBe('hi');
    expect(messageWithDefault).toBe('Hello');
  });

  it("Returns correct fallback message when key doesn't exist", () => {
    const { translate } = hook.result.current;

    const message = translate('common.hey');
    const messageWithDefault = translate('common.hey', { defaultMessage: 'Hello' });

    expect(message).toBe('common.hey');
    expect(messageWithDefault).toBe('Hello');
  });

  it('Replaces placeholders correctly for dynamic messages', () => {
    const { translate } = hook.result.current;

    const message = translate('common.welcome', { values: { name: 'Peter' } });

    expect(message).toBe('Welcome Peter');
  });

  it('Replaces placeholders correctly in default message for dynamic messages', () => {
    const { translate } = hook.result.current;

    const message = translate('common.hey', { defaultMessage: 'Welcome {name}', values: { name: 'Peter' } });

    expect(message).toBe('Welcome Peter');
  });
});
