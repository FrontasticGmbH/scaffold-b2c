import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import toast from 'react-hot-toast';
import Toaster from '.';
import Button from '../button';
import Typography from '../typography';

export default {
  title: 'Atoms/Toaster',
  component: Toaster,
} as ComponentMeta<typeof Toaster>;

const Template: ComponentStory<typeof Toaster> = () => (
  <div className="ml-44">
    <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Toaster</Typography>
    <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Toaster component allows customers to show a toast message. It has a success and error variant.
    </Typography>

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
