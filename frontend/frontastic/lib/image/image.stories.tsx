import { Meta, StoryFn } from '@storybook/react';
import Image, { ImageProps } from '.';

export default {
  title: 'Atoms/Image',
  component: Image,
} as Meta;

const Template: StoryFn<ImageProps> = (args) => <Image {...args} />;

export const Optimized = Template.bind({});
Optimized.args = {
  media: {
    mediaId: 'w6m0l0rw2j8okyyv0twm',
    file: 'https://res.cloudinary.com/dlwdq84ig/image/upload/v1704277263/w6m0l0rw2j8okyyv0twm.jpg',
    size: 516362,
    width: 1378,
    height: 1378,
    format: 'jpg',
  },
};

export const UnOptimized = Template.bind({});
UnOptimized.args = {
  src: 'https://res.cloudinary.com/dlwdq84ig/image/upload/v1704277263/w6m0l0rw2j8okyyv0twm.jpg',
  width: 680,
  height: 340,
};
