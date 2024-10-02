import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Meta, StoryFn } from '@storybook/react';
import Button from 'components/commercetools-ui/atoms/button';
import Typography from 'components/commercetools-ui/atoms/typography';
import Modal, { ModalProps } from '.';

export default {
  title: 'Organisms/Modal',
  component: Modal,
  argTypes: {},
} as Meta;

const Template: StoryFn<ModalProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ml-44">
      <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Modal Component</Typography>
      <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
        The Modal component displays content on a dark overlay. It can be used to display additional information or
        actions.
      </Typography>
      <div className="mt-44 w-400 pr-20">
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          shouldCloseOnOverlayClick
          contentLabel="Hello there"
          preventScroll={false}
          style={{ content: { backgroundColor: 'white' } }}
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
        >
          <div className="px-20 py-50">
            <XMarkIcon
              className="absolute right-15 top-15 size-24 hover:cursor-pointer"
              strokeWidth={1}
              color="#494949"
              onClick={() => setIsOpen(false)}
            />
            <Typography className="text-20" as="h1">
              Please be aware of this content.
            </Typography>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export const Default = Template.bind({});
