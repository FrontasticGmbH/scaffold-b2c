import { Meta, StoryFn } from '@storybook/react';
import InfoBanner from '.';

export default {
  title: 'Molecules/Info Banner',
  component: InfoBanner,
  argTypes: {
    variant: {
      options: ['primary', 'warning'],
      defaultValue: 'primary',
      control: { type: 'select' },
    },
  },
} as Meta<typeof InfoBanner>;

const Template: StoryFn<typeof InfoBanner> = (args) => <InfoBanner {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: (
    <>
      <b>View-Only</b> For full permissions, please contact your company administrator.
    </>
  ),
};
