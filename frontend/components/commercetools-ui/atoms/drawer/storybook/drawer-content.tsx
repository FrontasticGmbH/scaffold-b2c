import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from 'components/commercetools-ui/organisms/modal';
import Drawer from '..';
import Toaster from '../../toaster';
import Typography from '../../typography';

const DrawerContent = () => {
  const [isOpenLeftMenu, setIsOpenLeftMenu] = useState(false);
  const [isOpenRightMenu, setIsOpenRightMenu] = useState(false);
  const [isOpenTopMenu, setIsOpenTopMenu] = useState(false);
  const [isOpenBottomMenu, setIsOpenBottomMenu] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const showToast = (variant: string) => {
    const msg = "Hello, I'm a toast!";
    switch (variant) {
      case 'info':
        return toast(msg);
      case 'success':
        return toast.success(msg);
      case 'error':
        return toast.error(msg);
    }
  };
  return (
    <div className="ml-44">
      <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Menu components</Typography>

      <Typography className="mt-40 w-2/5 text-24 font-medium text-black">Drawer</Typography>

      <Typography className="mt-16 w-3/5 text-16 leading-loose text-neutral-700">
        The Drawer Component displays additional content or options that are hidden off-screen until the user activates
        them. It consists of a panel that slides in or out from the edge of the screen when a user clicks a button or
        performs a specific action.
      </Typography>

      <div className="mt-32 w-full">
        <button
          className="rounded-md bg-primary px-16 py-8 text-white transition hover:bg-neutral-500"
          onClick={() => setIsOpenLeftMenu(!isOpenLeftMenu)}
        >
          Open left drawer
        </button>
        <Drawer direction="left" isOpen={isOpenLeftMenu} onClose={() => setIsOpenLeftMenu(false)}>
          <div className="size-full min-w-300 bg-white p-24">
            Hello there, I&apos;m a left Menu; click outside to close me!
          </div>
        </Drawer>
      </div>

      <div className="mt-20 w-full">
        <button
          className="rounded-md bg-primary px-16 py-8 text-white transition hover:bg-neutral-500"
          onClick={() => setIsOpenRightMenu(!isOpenRightMenu)}
        >
          Open right drawer
        </button>
        <Drawer direction="right" isOpen={isOpenRightMenu} onClose={() => setIsOpenRightMenu(false)}>
          <div className="size-full min-w-300 bg-white p-24">
            Hello there, I&apos;m a right Menu; click outside to close me!
          </div>
        </Drawer>
      </div>

      <div className="mt-20 w-full">
        <button
          className="rounded-md bg-primary px-16 py-8 text-white transition hover:bg-neutral-500"
          onClick={() => setIsOpenTopMenu(!isOpenTopMenu)}
        >
          Open top drawer
        </button>
        <Drawer direction="top" isOpen={isOpenTopMenu} onClose={() => setIsOpenTopMenu(false)}>
          <div className="size-full min-w-300 bg-white p-24">
            Hello there, I&apos;m a Top Menu; click outside to close me!
          </div>
        </Drawer>
      </div>

      <div className="mt-20 w-full">
        <button
          className="rounded-md bg-primary px-16 py-8 text-white transition hover:bg-neutral-500"
          onClick={() => setIsOpenBottomMenu(!isOpenBottomMenu)}
        >
          Open bottom drawer
        </button>
        <Drawer direction="bottom" isOpen={isOpenBottomMenu} onClose={() => setIsOpenBottomMenu(false)}>
          <div className="size-full min-w-300 bg-white p-24">
            Hello there, I&apos;m a Bottom Menu; click outside to close me!
          </div>
        </Drawer>
      </div>

      <Typography className="mt-40 w-2/5 text-24 font-medium text-black">Modal</Typography>

      <Typography className="mt-16 w-3/5 text-16 leading-loose text-neutral-700">
        The Modal Component consists of a pop-up window that appears in front of the current view, blocking access to
        the rest of the page until the user performs a specific action or dismisses the modal. The modal can be exited
        by pressing the close button in the corner or pressing outside of the modal.
      </Typography>

      <div className="mt-24 w-full">
        <button
          className="rounded-md bg-primary px-16 py-8 text-white transition hover:bg-neutral-500"
          onClick={() => setIsOpenModal(!isOpenModal)}
        >
          Open modal
        </button>
        <Modal isOpen={isOpenModal} onRequestClose={() => setIsOpenModal(false)}>
          <div className="min-h-300 bg-white p-24">Hello there! I&apos;m a modal click outside to close me</div>
        </Modal>
      </div>

      <Typography className="mt-40 w-2/5 text-24 font-medium text-black">Toast</Typography>

      <Typography className="mt-16 w-3/5 text-16 leading-loose text-neutral-700">
        The Toast Component displays brief notifications or feedback to the user. It consists of a small pop-up window
        that appears at the top of the screen for a short period of time.
      </Typography>

      <div className="mt-24 w-full">
        <button onClick={() => showToast('success')} className="rounded-md border border-gray-600 p-8 hover:shadow-300">
          Make a Success Toast
        </button>
        <Toaster />
      </div>

      <div className="mt-20 w-full">
        <button onClick={() => showToast('info')} className="rounded-md border border-gray-600 p-8 hover:shadow-300">
          Make an Info Toast
        </button>
        <Toaster />
      </div>

      <div className="mt-20 w-full">
        <button onClick={() => showToast('error')} className="rounded-md border border-gray-600 p-8 hover:shadow-300">
          Make an Error Toast
        </button>
        <Toaster />
      </div>
    </div>
  );
};

export default DrawerContent;
