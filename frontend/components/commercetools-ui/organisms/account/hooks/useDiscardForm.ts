import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

const useDiscardForm = () => {
  const router = useRouter();

  const discardForm = useCallback(() => {
    router.back();
  }, [router]);

  return { discardForm };
};

export default useDiscardForm;
