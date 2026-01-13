// eslint-disable-next-line no-restricted-imports -- Need full path WITH locale for usePath contract
import { usePathname } from 'next/navigation';

const usePath = () => {
  // Use next/navigation to get the FULL path WITH locale
  const absolutePath = usePathname();

  // Handle null case when not in Next.js context (e.g., Storybook)
  if (!absolutePath) {
    return { path: '/', absolutePath: '/', pathWithoutQuery: '/' };
  }

  // Strip the locale prefix to get path WITHOUT locale
  // e.g., '/en/account/settings' -> '/account/settings'
  const pathSegments = absolutePath.split('/').slice(2).join('/');
  const path = pathSegments ? `/${pathSegments}` : '/';

  // Remove query parameters from the path without locale
  const pathWithoutQuery = pathSegments ? `/${pathSegments.split('?')[0]}` : '/';

  return {
    path,
    absolutePath,
    pathWithoutQuery,
  };
};
export default usePath;
