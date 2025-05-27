import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import PasswordInput from '.';

export default {
  title: 'Atoms/Input Password',
  component: PasswordInput,
  argTypes: {},
} as Meta;

const Template: StoryFn<typeof PasswordInput> = (args) => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Input Field</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Password Input Field allows customers to enter a password. It has a top label, placeholder and validation.
    </p>

    <div className="mt-40 flex w-full justify-start gap-x-80">
      <div className="w-[30%]">
        <div className="w-full">
          <div>
            <PasswordInput {...args} variant="primary" placeholder="Placeholder" label="Primary password" />
          </div>
          <div className="mt-16">
            <PasswordInput
              {...args}
              variant="primary"
              error="An error occurred while entering an unworthy password"
              placeholder="Placeholder"
              label="Primary password - Invalid"
              className="border-red-500"
            />
          </div>
          <div className="mt-16">
            <PasswordInput {...args} variant="secondary" placeholder="Placeholder" label="Secondary password" />
          </div>
          <div className="mt-16">
            <PasswordInput
              {...args}
              variant="secondary"
              placeholder="Placeholder"
              label="Secondary password - valid"
              className="border-green-500"
              isDirty={true}
            />
          </div>
          <div className="mt-16">
            <PasswordInput {...args} disabled placeholder="Placeholder" label="Disabled password" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Default = Template.bind({});
