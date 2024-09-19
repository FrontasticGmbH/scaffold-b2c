import React from 'react';
import { useRouter } from 'next/navigation';
import { Popover } from '@headlessui/react';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { useFormat } from 'helpers/hooks/useFormat';
import { useAccount } from 'frontastic';

const LoggedIn = () => {
  const router = useRouter();
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const { logout } = useAccount();

  const handleLogout = () => {
    logout().then(() => router.push('/login'));
  };

  return (
    <div className="w-235 p-14">
      <Popover.Button className="w-full">
        <Link link="/account#" className="mt-10 block w-fit">
          <Typography className="text-primary-black hover:underline">
            {formatAccountMessage({ id: 'my.account', defaultMessage: 'My Account' })}
          </Typography>
        </Link>
      </Popover.Button>

      <Popover.Button className="w-full">
        <Link link="/account#support" className="mt-32 block w-fit">
          <Typography className="text-primary-black hover:underline">
            {formatAccountMessage({ id: 'customer.support', defaultMessage: 'Customer support' })}
          </Typography>
        </Link>
      </Popover.Button>

      <Popover.Button className="mt-32 block w-full pb-10">
        <div onClick={handleLogout} className="w-fit">
          <Typography className="text-16 text-primary-black hover:underline">
            {formatAccountMessage({ id: 'sign.out', defaultMessage: 'Sign out' })}
          </Typography>
        </div>
      </Popover.Button>
    </div>
  );
};

export default LoggedIn;
