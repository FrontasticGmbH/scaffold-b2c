import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import CategorySlider, { Props } from '.';

export default {
  title: 'Organisms/Category Slider',
  component: CategorySlider,
} as Meta<typeof CategorySlider>;

const Template: StoryFn<typeof CategorySlider> = (args) => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Category Slider</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Product Category Slider displays a selection of product categories.
    </p>
    <div className="mt-44 justify-start">
      <CategorySlider {...args} />
    </div>
  </div>
);

const tiles = [
  {
    title: 'Sofas & Armchairs',
    image: {
      src: 'https://static.dezeen.com/uploads/2022/05/ella-chair-matthew-hilton-case-furniture-design_dezeen_2364_hero.jpg',
    },
  },
  {
    title: 'Home Decor',
    image: {
      src: 'https://static.dezeen.com/uploads/2022/05/ella-chair-matthew-hilton-case-furniture-design_dezeen_2364_hero.jpg',
    },
  },
  {
    title: 'Curtains & Drapes',
    image: {
      src: 'https://static.dezeen.com/uploads/2022/05/ella-chair-matthew-hilton-case-furniture-design_dezeen_2364_hero.jpg',
    },
  },
  {
    title: 'Sofas & Armchairs',
    image: {
      src: 'https://static.dezeen.com/uploads/2022/05/ella-chair-matthew-hilton-case-furniture-design_dezeen_2364_hero.jpg',
    },
  },
] as Props['tiles'];

export const Default = Template.bind({});
Default.args = { tiles };
