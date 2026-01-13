/**
 * Mock for Next.js navigation hooks in Storybook
 * Prevents "invariant expected app router to be mounted" errors
 */

export const useRouter = () => ({
  push: (href: string, options?: any) => {
    console.log('[Storybook Mock] useRouter.push:', href, options);
  },
  replace: (href: string, options?: any) => {
    console.log('[Storybook Mock] useRouter.replace:', href, options);
  },
  back: () => {
    console.log('[Storybook Mock] useRouter.back');
  },
  forward: () => {
    console.log('[Storybook Mock] useRouter.forward');
  },
  refresh: () => {
    console.log('[Storybook Mock] useRouter.refresh');
  },
  prefetch: (href: string) => {
    console.log('[Storybook Mock] useRouter.prefetch:', href);
    return Promise.resolve();
  },
});

export const usePathname = () => {
  return '/en';
};

export const useParams = () => {
  return { locale: 'en' };
};

export const useSearchParams = () => {
  const mockSearchParams = new URLSearchParams();

  return {
    get: (key: string) => mockSearchParams.get(key),
    getAll: (key: string) => mockSearchParams.getAll(key),
    has: (key: string) => mockSearchParams.has(key),
    keys: () => mockSearchParams.keys(),
    values: () => mockSearchParams.values(),
    entries: () => mockSearchParams.entries(),
    forEach: (callback: any) => mockSearchParams.forEach(callback),
    toString: () => mockSearchParams.toString(),
    [Symbol.iterator]: () => mockSearchParams[Symbol.iterator](),
  };
};

export const useSelectedLayoutSegment = () => null;
export const useSelectedLayoutSegments = () => [];

export const notFound = () => {
  console.log('[Storybook Mock] notFound()');
};

export const redirect = (url: string) => {
  console.log('[Storybook Mock] redirect:', url);
};

export const permanentRedirect = (url: string) => {
  console.log('[Storybook Mock] permanentRedirect:', url);
};

// Mock ReadonlyURLSearchParams
export class ReadonlyURLSearchParams extends URLSearchParams {
  append() {
    throw new Error('Method not supported');
  }
  delete() {
    throw new Error('Method not supported');
  }
  set() {
    throw new Error('Method not supported');
  }
}
