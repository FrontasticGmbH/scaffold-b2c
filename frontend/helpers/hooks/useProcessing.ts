import { useCallback, useState } from 'react';

const useProcessing = () => {
  const [processing, setProcessing] = useState(false);

  const startProcessing = useCallback(() => setProcessing(true), []);

  const stopProcessing = useCallback(() => setProcessing(false), []);

  return { processing, startProcessing, stopProcessing };
};

export default useProcessing;
