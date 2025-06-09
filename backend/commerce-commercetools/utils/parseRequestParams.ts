const parseQueryParams = <T extends Record<string, unknown>>(query: T): Partial<T> => {
  const queryParams: Partial<T> = {};
  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      queryParams[key] = query[key];
    }
  }

  return queryParams;
};
export default parseQueryParams;
