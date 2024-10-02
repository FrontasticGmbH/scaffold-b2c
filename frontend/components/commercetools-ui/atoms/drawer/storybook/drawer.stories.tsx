import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Drawer from '..';
import DrawerContent from './drawer-content';

export default {
  title: 'Organisms/Drawer',
  component: Drawer,
} as Meta<typeof Drawer>;

const Template: StoryFn<typeof Drawer> = () => <DrawerContent />;
export const Default = Template.bind({});
