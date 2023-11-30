import { usePathname } from 'next/navigation';

const usePath = () => {
  const absolutePath = usePathname();

  const path = absolutePath.split('/').slice(2).join('/') ?? '/';

  const pathWithoutQuery = `/${path.split('?')[0]}`;

  return { path: `/${path}`, absolutePath, pathWithoutQuery };
};
export default usePath;
