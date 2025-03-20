import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { footerColumns, footerLogo, footerSocialMediaLinks } from 'helpers/mocks/mockFooterData';
import Footer, { Props as FooterProps } from './index';

export default {
  title: 'Organisms/Footer',
  component: Footer,
  argTypes: {},
} as Meta;

const Template: StoryFn<FooterProps> = (args) => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Page Footer</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Footer component provides important information and links. It includes a logo, navigation links and social
      links.
    </p>
    <div className="mt-40">
      <Footer {...args} columns={footerColumns} logo={footerLogo} socialMedia={footerSocialMediaLinks} />
    </div>
  </div>
);

export const Default = Template.bind({});
