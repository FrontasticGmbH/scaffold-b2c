import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import AnnouncementBar from '.';

export default {
  title: 'Organisms/Announcement Bar',
  component: AnnouncementBar,
} as Meta<typeof AnnouncementBar>;

const Template: StoryFn<typeof AnnouncementBar> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Announcement Bar</Typography>
    <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Announcement Bar component appears at the top of the page and includes a textlink.
    </Typography>
    <div className="mt-44 flex w-1/2 justify-start">
      <AnnouncementBar {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});

Default.args = {
  text: 'SUBSCRIBE FOR 10% OFF YOUR FIRST ORDER',
  highlightedSubstring: 'SUBSCRIBE',
};
