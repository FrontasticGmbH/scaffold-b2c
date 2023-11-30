const queryParamsToStates = <T>(param: string, queryParams: any): T[] => {
  const states: T[] = [];

  const requestParamStates = queryParams?.[param];

  if (requestParamStates) {
    if (Array.isArray(requestParamStates)) {
      states.push(...requestParamStates);
    } else {
      const params = requestParamStates.split(',');
      if (params.length > 1) {
        states.push(...params);
      } else {
        states.push(requestParamStates);
      }
    }
  }

  return states;
};

export default queryParamsToStates;
