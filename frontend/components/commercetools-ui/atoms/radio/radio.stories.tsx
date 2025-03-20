import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Radio from '.';

export default {
  title: 'Atoms/Radio',
  component: Radio,
} as Meta<typeof Radio>;

const Template: StoryFn<typeof Radio> = (args) => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Radio Button</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Radio Button allows customers to select a single option from a list of predefined choices.
    </p>

    <div className="mt-40 flex w-[70%]">
      <span className="mr-8">Radio Button</span>
      <Radio {...args} />
    </div>
  </div>
);

export const Primary = Template.bind({});
Primary.args = { checked: true };
