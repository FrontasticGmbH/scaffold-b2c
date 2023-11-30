import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import DrawerContent from './drawer-content';
import Drawer from '..';

export default {
  title: 'Components/Menus',
  component: Drawer,
} as ComponentMeta<typeof Drawer>;

const Template: ComponentStory<typeof Drawer> = () => <DrawerContent />;
export const Default = Template.bind({});
