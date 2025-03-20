import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import toast from 'react-hot-toast';
import Toaster from '.';
import Button from '../button';

export default {
  title: 'Atoms/Toaster',
  component: Toaster,
} as Meta<typeof Toaster>;

const Template: StoryFn<typeof Toaster> = () => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Toaster</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Toaster component allows customers to show a toast message. It has a success and error variant.
    </p>

    <div className="mt-40 grid w-300 gap-16">
      <Toaster />
      <Button onClick={() => toast.success('Success message')}>Show success message</Button>
      <Button variant="secondary" onClick={() => toast.error('Error message')}>
        Show error message
      </Button>
    </div>
  </div>
);

export const Default = Template.bind({});

Default.args = {};
