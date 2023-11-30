//import { FetcherError } from '@commerce/utils/errors'
import { FrontasticError } from './frontastic-error';

export function getError(errors: any[], status: number) {
  //return new FetcherError({ errors, status })

  return new FrontasticError(`Error, ${status}`, status);
}

export async function getAsyncError(res: Response) {
  const data = await res.json();
  return getError(data.errors, res.status);
}

const handleFetchResponse = async (res: Response) => {
  if (res.ok) {
    const data = await res.json();

    // Frontastic api currently doesn't handle errors
    // add later here
    // if (errors && errors.length) {
    //   throw getError(errors, res.status);
    // }

    return data;
  }

  return await getAsyncError(res);
};

export default handleFetchResponse;
