import { Meta, StoryFn } from '@storybook/react';
import QuantitySelector from '.';

export default {
  title: 'Atoms/Quantity Selector',
  component: QuantitySelector,
} as Meta<typeof QuantitySelector>;

const Template: StoryFn<typeof QuantitySelector> = (args) => <QuantitySelector {...args} />;

export const Default = Template.bind({});

export const Controlled = Template.bind({});
Controlled.args = {
  value: 10,
};
