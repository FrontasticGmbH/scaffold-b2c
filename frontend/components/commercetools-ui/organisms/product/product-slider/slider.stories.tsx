import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { products, shippingMethods } from 'helpers/mocks/mockCommonData';
import ProductSlider, { ProductSliderProps } from '.';

export default {
  title: 'Organisms/Product Slider',
  component: ProductSlider,
  argTypes: {},
} as Meta;

const Template: StoryFn<ProductSliderProps> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Product Slider</Typography>
    <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Product Slider showcases a selection of products. It consists of a horizontal strip of cards that can be
      scrolled through using arrows or swiping. It includes product name, price, images and a Quick-view button.
    </Typography>
    <div className="mt-40 w-4/5 pl-44">
      <ProductSlider
        {...args}
        products={products}
        shippingMethods={shippingMethods}
        title="This is a Product Slider"
        ctaLabel="A Call to Action"
        classNames={{ title: 'pt-20' }}
        onAddToCart={async () => {}}
      />
    </div>
  </div>
);

export const Default = Template.bind({});

Default.args = {};
