import { render } from '__test__/utils';
import Redirect from '.';

const router = { push: jest.fn() };

jest.mock('i18n/routing', () => {
  return {
    useRouter: () => router,
    usePathname: () => '/en',
  };
});

describe('Redirect', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to target when target is defined', () => {
    render(<Redirect target="/categories" />);
    expect(router.push).toHaveBeenCalledWith('/categories');
  });

  it('should not redirect when target is not available', () => {
    render(<Redirect />);
    expect(router.push).not.toHaveBeenCalled();
  });
});
