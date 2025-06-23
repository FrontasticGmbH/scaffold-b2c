const queryParamsToStates = <T extends string>(param: string, queryParams: Record<string, T>): T[] => {
  const states: T[] = [];

  const requestParamStates = queryParams[param];

  if (requestParamStates) {
    if (Array.isArray(requestParamStates)) {
      requestParamStates.forEach((value) => states.push(value));
    } else {
      requestParamStates.split(',').forEach((value) => states.push(value as T));
    }
  }

  return states;
};

export default queryParamsToStates;
