import React from 'react';
import { Story, Meta } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import { footerColumns, footerLogo, footerSocialMediaLinks } from 'helpers/mocks/mockFooterData';
import Footer, { Props as FooterProps } from './index';

export default {
  title: 'Components/Footer',
  component: Footer,
  argTypes: {},
} as Meta;

const Template: Story<FooterProps> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Page Footer</Typography>
    <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
      The Footer component provides important information and links. It includes a logo, navigation links and social
      links.
    </Typography>
    <div className="mt-40">
      <Footer {...args} columns={footerColumns} logo={footerLogo} socialMedia={footerSocialMediaLinks} />
    </div>
  </div>
);

export const Default = Template.bind({});
