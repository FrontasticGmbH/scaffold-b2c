import { useCallback, useState } from 'react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import Button from 'components/commercetools-ui/atoms/button';
import Typography from 'components/commercetools-ui/atoms/typography';
import Modal from 'components/commercetools-ui/organisms/modal';
import { useFormat } from 'helpers/hooks/useFormat';
import Login from '../../authentication/login';

const LoginSuggestion = () => {
  const { formatMessage: formatCartMessage } = useFormat({ name: 'cart' });
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const loginLink = '/login?lvp=cart';

  return (
    <>
      <Typography className="mt-18 border-t border-neutral-400 pt-16 text-14 leading-[20px] text-secondary-black md:text-16 lg:border-none">
        {formatCartMessage({
          id: 'order.summary.login',
          defaultMessage: 'Log in to use your personal offers!',
        })}
      </Typography>
      <Button
        className="mt-18 py-12 text-14 font-medium md:text-16"
        onClick={openLoginModal}
        size="full"
        variant="secondary"
      >
        {formatAccountMessage({ id: 'sign.in', defaultMessage: ' Login in' })}
      </Button>

      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={closeLoginModal}
        className="relative w-[90%] rounded-md bg-white"
        style={{ content: { maxWidth: '600px' } }}
        closeTimeoutMS={200}
      >
        <CloseIcon
          className="absolute right-20 top-20 h-24 w-24 cursor-pointer text-secondary-black"
          onClick={closeLoginModal}
        />
        <div className="p-1 pb-48 pt-72">
          <Login onLogin={closeLoginModal} signInLink={{ type: 'link', link: loginLink }} />
        </div>
      </Modal>
    </>
  );
};

export default LoginSuggestion;
