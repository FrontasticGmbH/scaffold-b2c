import React from 'react';
import { useRouter } from 'next/navigation';
import { Popover } from '@headlessui/react';
import Button from 'components/commercetools-ui/atoms/button';
import Link from 'components/commercetools-ui/atoms/link';
import { useFormat } from 'helpers/hooks/useFormat';

const LoggedOut = () => {
  const router = useRouter();
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const goToLoginPage = () => router.push('/login');

  return (
    <div className="w-[235px] p-14">
      <Popover.Button as="div" className="w-full">
        <Button variant="primary" className="w-full py-12 text-16 leading-[16px]" onClick={goToLoginPage}>
          {formatAccountMessage({ id: 'sign.in', defaultMessage: 'Sign in' })}
        </Button>
      </Popover.Button>
      <Popover.Button>
        <Link link="/" className="mt-20 block w-fit text-primary-black hover:underline">
          {formatAccountMessage({ id: 'membership.info', defaultMessage: 'Membership info' })}
        </Link>
      </Popover.Button>
      <div className="mt-32 flex pb-10 ">
        <span className="whitespace-nowrap">
          {formatAccountMessage({ id: 'not.member', defaultMessage: 'Not a member' })}?
        </span>
        <Popover.Button>
          <Link link="/register" className="ml-4 whitespace-nowrap font-medium text-primary-black hover:underline">
            {formatAccountMessage({ id: 'join.here', defaultMessage: 'Join here' })}
          </Link>
        </Popover.Button>
      </div>
    </div>
  );
};

export default LoggedOut;
