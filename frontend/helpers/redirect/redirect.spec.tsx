import { useRouter } from 'next/navigation';
import { render } from '__test__/utils';
import Redirect from '.';

jest.mock('next/navigation', () => {
  const router = {
    push: jest.fn(),
  };
  return {
    useRouter: jest.fn().mockReturnValue(router),
  };
});

describe('Redirect', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to target when target is defined', () => {
    const router = useRouter();
    render(<Redirect target="/categories" />);
    expect(router.push).toHaveBeenCalledWith('/categories');
  });

  it('should not redirect when target is not available', () => {
    const router = useRouter();
    render(<Redirect />);
    expect(router.push).not.toHaveBeenCalled();
  });
});
