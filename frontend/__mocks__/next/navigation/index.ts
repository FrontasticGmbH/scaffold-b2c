export const useParams = () => {
  return { locale: 'en' };
};

export const usePathname = () => {
  return '/';
};

export const useSearchParams = () => {
  return new Map();
};

export const useRouter = () => {
  return { push: () => {} };
};
