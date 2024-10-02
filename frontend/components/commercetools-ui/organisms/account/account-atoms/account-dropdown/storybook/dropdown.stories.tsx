import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import AccountDropdownContent from '.';
import AccountDropdown from '..';

export default {
  title: 'Organisms/Account Popover',
  component: AccountDropdown,
} as Meta<typeof AccountDropdown>;

const Template: StoryFn<typeof AccountDropdown> = () => <AccountDropdownContent />;
export const Default = Template.bind({});
