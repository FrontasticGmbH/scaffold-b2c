function queryParamsToIds<T extends string>(
  param: string,
  queryParams: Record<string, string | string[] | undefined>,
): string[] {
  const ids: T[] = [];

  const requestParamIds = queryParams?.[param];

  if (requestParamIds) {
    if (Array.isArray(requestParamIds)) {
      ids.push(...requestParamIds);
    } else {
      const params = requestParamIds.split(',');
      if (params.length > 1) {
        ids.push(...params);
      } else {
        ids.push(requestParamIds);
      }
    }
  }

  return ids;
}

export default queryParamsToIds;
