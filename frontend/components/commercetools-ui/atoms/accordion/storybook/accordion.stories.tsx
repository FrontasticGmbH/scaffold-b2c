import React from 'react';
import { Story, Meta } from '@storybook/react';
import AccordionContent from './accordion-content';
import Accordion from '../index';

export default {
  title: 'Components/Accordion',
  component: Accordion,
  argTypes: {},
} as Meta;

const Template: Story = () => <AccordionContent />;

export const Default = Template.bind({});
