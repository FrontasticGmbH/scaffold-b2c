import { IncomingMessage } from 'http';
import { cookies } from 'next/headers';
import { ServerOptions } from '@commercetools/frontend-sdk';

const getServerOptions = () => {
  const cookieStore = cookies();
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
