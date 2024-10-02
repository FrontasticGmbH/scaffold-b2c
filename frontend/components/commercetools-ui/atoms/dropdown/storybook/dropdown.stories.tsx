import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Dropdown, { DropdownProps } from '..';
import DropdownContent from './dropdown-content';

export default {
  title: 'Atoms/Dropdown',
  component: Dropdown,
} as Meta;

const Template: StoryFn<DropdownProps> = () => <DropdownContent />;

export const Primary = Template.bind({});
