import { Meta, StoryFn } from '@storybook/react';
import Checkbox from '.';

export default {
  title: 'Atoms/Checkbox',
  component: Checkbox,
} as Meta<typeof Checkbox>;

const Template: StoryFn<typeof Checkbox> = (args) => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Checkbox</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Checkbox component allows customers to select one or more items from a list of options.
    </p>

    <div className="mt-40 flex w-[70%]">
      <span className="mr-8">Checkbox</span>
      <Checkbox {...args} />
    </div>
  </div>
);

export const Primary = Template.bind({});
