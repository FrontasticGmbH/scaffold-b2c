import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import AccountDropdownContent from '.';
import AccountDropdown from '..';

export default {
  title: 'Components/Account Popover',
  component: AccountDropdown,
} as ComponentMeta<typeof AccountDropdown>;

const Template: ComponentStory<typeof AccountDropdown> = () => <AccountDropdownContent />;
export const Default = Template.bind({});
