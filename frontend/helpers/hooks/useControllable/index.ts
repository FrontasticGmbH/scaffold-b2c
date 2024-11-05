import { useState } from 'react';

const useControllableState = <T = unknown | undefined>(propValue?: T, initialValue?: T) => {
  const [state, setState] = useState<T>((propValue ?? initialValue) as T);

  return [propValue ?? state, setState] as const;
};

export default useControllableState;
