const queryParamsToStates = <T extends string>(
  param: string,
  queryParams: Record<string, string | string[] | undefined>,
): T[] => {
  const states: T[] = [];

  const requestParamStates = queryParams[param];

  if (requestParamStates) {
    if (Array.isArray(requestParamStates)) {
      requestParamStates.forEach((value) => states.push(value as T));
    } else {
      requestParamStates.split(',').forEach((value) => states.push(value as T));
    }
  }

  return states;
};

export default queryParamsToStates;
