import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { headerButtonLink } from 'helpers/mocks/mockData';
import { Reference } from 'types/reference';
import Hero, { HeroProps } from '.';

export default {
  title: 'Organisms/Hero Tile',
  component: Hero,
  argTypes: {},
} as Meta;

const Template: StoryFn<HeroProps> = () => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Hero Tile Component</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Hero Tile Component displays content in a grid layout. It displays an image, title, short description and a
      CTA button. It is a larger version of the Tile component.
    </p>
    <div className="mt-44 pr-20">
      <Hero
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
        imageQuality={75}
        isPriority={false}
      />
    </div>
  </div>
);

export const Default = Template.bind({});
