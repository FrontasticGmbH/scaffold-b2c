import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import ResetPassword, { ResetPasswordProps } from './index';
import ResetPasswordForm from './reset-password-form';

export default {
  title: 'Organisms/Reset Password',
  component: ResetPassword,
  argTypes: {},
} as Meta;

const Template: StoryFn<ResetPasswordProps> = (args) => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Reset password</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Reset Password Form allows customers to reset their account password. It has two input fields for creating a
      new password and a confirmation field.
    </p>
    <div className="ml-80 mt-44 w-[30%] gap-x-50">
      <ResetPasswordForm {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {};
