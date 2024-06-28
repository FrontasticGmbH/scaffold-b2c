import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import CategorySlider, { Props } from '.';

export default {
  title: 'Organisms/Category Slider',
  component: CategorySlider,
} as ComponentMeta<typeof CategorySlider>;

const Template: ComponentStory<typeof CategorySlider> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Category Slider</Typography>
    <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
      The Product Category Slider displays a selection of product categories.
    </Typography>
    <div className="mt-44  justify-start">
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
