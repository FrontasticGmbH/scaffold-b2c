import React from 'react';
import { Story, Meta } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import Register, { RegisterProps } from './index';
import RegisterForm from './register-form';

export default {
  title: 'Components/Register',
  component: Register,
  argTypes: {},
} as Meta;

const Template: Story<RegisterProps> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Registration Form</Typography>
    <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
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
