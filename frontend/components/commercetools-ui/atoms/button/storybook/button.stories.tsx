import React from 'react';
import { Meta, Story } from '@storybook/react';
import ButtonContent from './button-content';
import Button, { ButtonProps } from '..';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {},
} as Meta;

const Template: Story<ButtonProps> = () => <ButtonContent />;

export const Default = Template.bind({});
