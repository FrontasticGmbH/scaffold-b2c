const parseQueryParams = <T>(query: any): T => {
  const queryParams: T = {} as T;

  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      queryParams[key] = query[key] as unknown as T[keyof T];
    }
  }

  return queryParams;
};
export default parseQueryParams;
