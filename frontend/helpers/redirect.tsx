import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Reference } from 'types/reference';
import { resolveReferenceTarget } from './reference';

export interface RedirectProps {
  target?: string | Reference;
}

const Redirect: React.FC<RedirectProps> = ({ target }) => {
  //next/navigation
  const router = useRouter();

  useEffect(() => {
    if (!target) return;
    //resolve href
    const resolvedTarget = typeof target === 'string' ? target : (resolveReferenceTarget(target) as string);
    //redirect upon mounting
    router.push(resolvedTarget);
  }, [target, router]);

  return <></>;
};

export default Redirect;
