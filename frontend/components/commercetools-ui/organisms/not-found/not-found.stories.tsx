import React from 'react';
import { Meta } from '@storybook/react';
import NotFound from '.';

export default {
  title: 'Pages/Not Found',
  component: NotFound,
  argTypes: {},
} as Meta;

const Template = () => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Not Found Page</p>
    <p className="mt-20 w-3/5 border-b border-neutral-400 pb-20 text-20 leading-loose text-neutral-700">
      The Not Found page is displayed when a user tries to access a page that does not exist.
    </p>
    <NotFound />
  </div>
);

export const Default = Template.bind({});
