import React from 'react';
import { Story, Meta } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { headerButtonLink } from 'helpers/mocks/mockData';
import { Reference } from 'types/reference';
import Tile, { TileProps } from './index';

export default {
  title: 'Molecules/Tile',
  component: Tile,
  argTypes: {},
} as Meta;

const Template: Story<TileProps> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Tile Component</Typography>
    <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
      The Tile Component displays content in a two grid layout. It displays an image, title, short description and a CTA
      button.
    </Typography>
    <div className="ml-80 mt-44">
      <Tile
        {...args}
        image={{
          src: 'https://res.cloudinary.com/dlwdq84ig/image/upload/w_1920,q_auto,c_scale/bwew6xc0u3s9ctxyirle',
        }}
        title="Here are some lovely texts just for testing if things go great, hopefully so"
        subtitle="Here are some lovely Subtitle texts just for testing"
        ctaLabel="Call To Action"
        ctaReference={headerButtonLink as Reference}
        className="h-[550px] w-[85%]"
      />
    </div>
  </div>
);

export const Default = Template.bind({});
