import { useSearchParams } from 'next/navigation';

const useHash = () => {
  const searchParams = useSearchParams();

  const hash = searchParams.get('hash') ?? '';

  const id = searchParams.get('id');

  return [hash, id] as const;
};

export default useHash;
