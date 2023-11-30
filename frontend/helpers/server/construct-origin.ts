import 'server-only';
import { headers } from 'next/headers';

export const constructOrigin = () => {
  const nextHeaders = headers();

  const host = nextHeaders.get('host');
  const protocol = nextHeaders.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');

  return `${protocol}://${host}`;
};
