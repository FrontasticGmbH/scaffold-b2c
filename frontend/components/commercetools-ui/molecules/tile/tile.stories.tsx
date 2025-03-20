import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { headerButtonLink } from 'helpers/mocks/mockData';
import { Reference } from 'types/reference';
import Tile, { TileProps } from './index';

export default {
  title: 'Molecules/Tile',
  component: Tile,
  argTypes: {},
} as Meta;

const Template: StoryFn<TileProps> = () => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Tile Component</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Tile Component displays content in a grid layout. It displays an image, title, short description and a CTA
      button.
    </p>
    <div className="mt-44 w-400 pr-20">
      <Tile
        image={{
          media: {
            mediaId: 'w6m0l0rw2j8okyyv0twm',
            file: 'https://res.cloudinary.com/dlwdq84ig/image/upload/v1704277263/w6m0l0rw2j8okyyv0twm.jpg',
          },
          fill: true,
        }}
        title="Here are some lovely texts just for testing if things go great, hopefully so"
        subtitle="Here are some lovely Subtitle texts just for testing"
        ctaLabel="Call To Action"
        ctaReference={headerButtonLink as Reference}
        className="h-320 lg:h-[475px]"
      />
    </div>
  </div>
);

export const Default = Template.bind({});
