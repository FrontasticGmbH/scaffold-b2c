import { render } from '__test__/utils';
import Redirect from '.';

const router = { push: jest.fn() };

jest.mock('next/navigation', () => {
  return {
    useLocale: () => 'en',
    useParams: () => ({ locale: 'en' }),
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
    expect(router.push).toHaveBeenCalledWith('/en/categories');
  });

  it('should not redirect when target is not available', () => {
    render(<Redirect />);
    expect(router.push).not.toHaveBeenCalled();
  });
});
