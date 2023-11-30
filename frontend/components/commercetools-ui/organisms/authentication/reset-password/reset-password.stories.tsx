import React from 'react';
import { Story, Meta } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import ResetPassword, { ResetPasswordProps } from './index';
import ResetPasswordForm from './reset-password-form';

export default {
  title: 'Components/Reset Password',
  component: ResetPassword,
  argTypes: {},
} as Meta;

const Template: Story<ResetPasswordProps> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Reset password</Typography>
    <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
      The Reset Password Form allows customers to reset their account password. It has two input fields for creating a
      new password and a confirmation field.
    </Typography>
    <div className="ml-80 mt-44 w-[30%] gap-x-50">
      <ResetPasswordForm {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {};
