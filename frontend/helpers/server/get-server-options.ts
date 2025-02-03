import { IncomingMessage } from 'http';
import { cookies } from 'next/headers';
import { ServerOptions } from '@commercetools/frontend-sdk';

const getServerOptions = async () => {
  const cookieStore = await cookies();
  const frontasticSession = cookieStore.get('frontastic-session');

  return {
    serverOptions: {
      req: {
        cookies: { 'frontastic-session': frontasticSession?.value },
      } as unknown as IncomingMessage,
    } as ServerOptions,
  };
};

export default getServerOptions;
