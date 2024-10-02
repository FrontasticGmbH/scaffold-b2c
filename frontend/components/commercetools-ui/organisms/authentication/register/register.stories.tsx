import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import Register from './index';
import RegisterForm, { RegisterFormProps } from './register-form';

export default {
  title: 'Organisms/Register',
  component: Register,
  argTypes: {},
} as Meta;

const Template: StoryFn<RegisterFormProps> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Registration Form</Typography>
    <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Registration Form allows customers to create a new account. It has input fields for the customer&apos;s
      personal information, such as name, email address, and password. It also has a checkbox for subscribing the
      newsletter, along with a button that when clicked, submits the form to create a new account.
    </Typography>
    <div className="ml-80 mt-44 w-[30%] gap-x-50">
      <RegisterForm {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});

Default.args = {};
