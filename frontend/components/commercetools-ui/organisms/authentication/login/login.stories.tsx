import React from 'react';
import { Story, Meta } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import Login, { LoginProps } from './index';
import LoginForm from './login-form';

export default {
  title: 'Organisms/Login',
  component: Login,
  argTypes: {},
} as Meta;

const Template: Story<LoginProps> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-2/5 text-28 font-bold text-black">Login Form</Typography>
    <Typography className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Login Form consists of two input fields for the customer&apos;s email and password, along with a button that
      when clicked, submits the form to authenticate the customer&apos;s credentials. The Login Form also includes a
      remember me checkbox and a password reset link.
    </Typography>
    <div className="ml-80 mt-44 w-[30%] gap-x-50">
      <LoginForm {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});

Default.args = {};
