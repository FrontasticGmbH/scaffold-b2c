import { Log } from '.';

describe('[Utility] Error logger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    Log.errors = [];
    Log.errorLogger = undefined;

    consoleSpy.mockRestore();
  });

  it('Logs warning level error correctly', () => {
    const err = { name: 'WARNING', message: 'WARNING MESSAGE!' };

    Log.warn(err);

    expect(consoleSpy).toHaveBeenCalledWith(Log.WARNING + ':', err);

    expect(Log.errors.length).toBe(1);

    expect(Log.errors[0].type).toEqual(Log.WARNING);
    expect(isNaN(new Date(Log.errors[0].date).getTime())).toBeFalsy();
    expect(Log.errors[0].data).toEqual([err]);
  });

  it('Logs error level error correctly', () => {
    const err = { name: 'ERROR', message: 'ERROR MESSAGE!' };

    Log.error(err);

    expect(consoleSpy).toHaveBeenCalledWith(Log.ERROR + ':', err);

    expect(Log.errors.length).toBe(1);

    expect(Log.errors[0].type).toEqual(Log.ERROR);
    expect(isNaN(new Date(Log.errors[0].date).getTime())).toBeFalsy();
    expect(Log.errors[0].data).toEqual([err]);
  });

  it('Functions only on client side as expected', () => {
    const windowSpy = jest.spyOn(window, 'window', 'get');

    windowSpy.mockImplementation(() => undefined as unknown as typeof window);

    const err = { name: 'ERROR', message: 'ERROR MESSAGE!' };

    Log.error(err);

    expect(consoleSpy).toHaveBeenCalledWith(Log.ERROR + ':', err);

    expect(Log.errors.length).toBe(0);

    windowSpy.mockRestore();
  });

  it('Works with a given error logger correctly', () => {
    const errorLogger = jest.fn();

    Log.setErrorLogger(errorLogger);

    const err = { name: 'ERROR', message: 'ERROR MESSAGE!' };

    Log.error(err);

    expect(consoleSpy).toHaveBeenCalledWith(Log.ERROR + ':', err);

    expect(Log.errors.length).toBe(0);

    expect(errorLogger).toHaveBeenCalled();

    expect(errorLogger.mock.calls[0].length).toBe(1);

    expect(errorLogger.mock.calls[0][0].type).toEqual(Log.ERROR);
    expect(isNaN(new Date(errorLogger.mock.calls[0][0].date).getTime())).toBeFalsy();
    expect(errorLogger.mock.calls[0][0].data).toEqual([err]);
  });

  it('Can retrieve all logged errors correctly sorted by their log/creation date', () => {
    const err1 = { name: 'ERROR 1', message: 'ERROR MESSAGE 1!' };
    const err2 = { name: 'ERROR 2', message: 'ERROR MESSAGE! 2' };

    jest.useFakeTimers();

    Log.error(err2);

    jest.advanceTimersByTime(100);

    Log.error(err1);

    expect(Log.errors.length).toBe(2);

    expect(Log.errors[0].data[0].name).toBe('ERROR 2');
    expect(Log.errors[1].data[0].name).toBe('ERROR 1');

    jest.useRealTimers();
  });
});
