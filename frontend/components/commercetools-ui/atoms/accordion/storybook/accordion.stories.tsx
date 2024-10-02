import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import AccordionContent from './accordion-content';
import Accordion from '../index';

export default {
  title: 'Organisms/Accordion',
  component: Accordion,
  argTypes: {},
} as Meta;

const Template: StoryFn<typeof AccordionContent> = () => <AccordionContent />;

export const Default = Template.bind({});
