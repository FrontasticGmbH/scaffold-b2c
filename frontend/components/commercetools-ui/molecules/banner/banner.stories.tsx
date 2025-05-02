import { Meta, StoryFn } from '@storybook/react';
import Banner from '.';

export default {
  title: 'Molecules/Banner',
  component: Banner,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} as Meta<typeof Banner>;

const Template: StoryFn<typeof Banner> = (args) => <Banner {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Lorem ipsum dolor sit amet consec tetur ',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  buttonText: 'Button text',
  buttonLink: { type: 'link', link: '#' },
  image: { src: '/images/category-banner.png' },
  size: 'md',
};
