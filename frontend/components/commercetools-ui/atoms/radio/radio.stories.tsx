import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Radio from '.';
import Typography from '../typography';

export default {
  title: 'Components/Radio',
  component: Radio,
} as ComponentMeta<typeof Radio>;

const Template: ComponentStory<typeof Radio> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Radio Button</Typography>
    <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
      The Radio Button allows customers to select a single option from a list of predefined choices.
    </Typography>

    <div className="mt-40 flex w-[70%]">
      <span className="mr-8">Radio Button</span>
      <Radio {...args} />
    </div>
  </div>
);

export const Primary = Template.bind({});
Primary.args = { checked: true };
