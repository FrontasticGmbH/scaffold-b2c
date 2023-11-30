import React from 'react';
import { Story, Meta } from '@storybook/react';
import DropdownContent from './dropdown-content';
import Dropdown, { DropdownProps } from '..';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
} as Meta;

const Template: Story<DropdownProps> = () => <DropdownContent />;

export const Primary = Template.bind({});
