import React, { useState } from 'react';
import { LockClosedIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Meta, StoryFn } from '@storybook/react';
import Button, { ButtonProps } from '.';

export default {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {},
} as Meta;

const Template: StoryFn<ButtonProps> = () => {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const toggleButtonFeedback = () => {
    setLoading(true);

    const loadingTimer = setTimeout(() => {
      setLoading(false);
      setAdded(true);
      clearTimeout(loadingTimer);

      const addedTimer = setTimeout(() => {
        setAdded(false);
        clearTimeout(addedTimer);
      }, 500);
    }, 1500);
  };

  return (
    <div className="ml-44">
      <p className="mt-40 w-2/5 text-28 font-bold text-black">Button</p>
      <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
        The base button component that can be styled in a variety of ways, including different sizes and colors.
      </p>

      <div className="mt-32 flex w-full justify-start">
        <div className="flex w-full flex-col">
          <p className="mt-12 w-2/5 text-24 font-medium text-black">Button sizing</p>
          <div className="mt-40 flex items-center">
            <p className="w-200 text-14 text-gray-600">Size icon:</p>
            <div className="ml-16">
              <Button variant="primary" size="icon" onClick={toggleButtonFeedback} loading={loading} added={added}>
                <TrashIcon className="w-20" />
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Size xs:</p>
            <div className="ml-16">
              <Button variant="primary" size="xs" onClick={toggleButtonFeedback} loading={loading} added={added}>
                Button
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Size sm:</p>
            <div className="ml-16">
              <Button variant="primary" size="s" onClick={toggleButtonFeedback} loading={loading} added={added}>
                Button
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Size md:</p>
            <div className="ml-16">
              <Button variant="primary" size="m" onClick={toggleButtonFeedback} loading={loading} added={added}>
                Button
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Size lg:</p>
            <div className="ml-16">
              <Button variant="primary" size="l" onClick={toggleButtonFeedback} loading={loading} added={added}>
                Button
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Size full width for 15 % panel:</p>
            <div className="ml-16 w-[30%]">
              <Button variant="primary" size="full" onClick={toggleButtonFeedback} loading={loading} added={added}>
                Button
              </Button>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col">
          <p className="mt-12 w-2/5 text-24 font-medium text-black">Button stylings</p>
          <div className="mt-40 flex w-full items-center">
            <p className="w-200 text-14 text-gray-600">Ghost button:</p>
            <div className="ml-16 w-[30%]">
              <Button variant="ghost" size="full" onClick={toggleButtonFeedback} loading={loading} added={added}>
                Ghost
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Primary button:</p>
            <div className="ml-16 w-[30%]">
              <Button variant="primary" size="full" onClick={toggleButtonFeedback} loading={loading} added={added}>
                Primary
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Secondary button:</p>
            <div className="ml-16 w-[30%]">
              <Button variant="secondary" size="full" onClick={toggleButtonFeedback} loading={loading} added={added}>
                Secondary
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Warning button:</p>
            <div className="ml-16 w-[30%]">
              <Button variant="warning" size="full" onClick={toggleButtonFeedback} loading={loading} added={added}>
                Warning
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Disabled button:</p>
            <div className="ml-16 w-[30%]">
              <Button
                variant="primary"
                size="full"
                disabled
                onClick={toggleButtonFeedback}
                loading={loading}
                added={added}
              >
                Disabled
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Underlined button:</p>
            <div className="ml-16 w-[30%]">
              <Button
                variant="underlined"
                size="full"
                onClick={toggleButtonFeedback}
                loading={loading}
                added={added}
                className="flex justify-center"
              >
                Underlined
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Primary icon left button:</p>
            <div className="ml-16 w-[30%]">
              <Button
                variant="primary"
                iconPosition="left"
                size="full"
                onClick={toggleButtonFeedback}
                loading={loading}
                added={added}
                icon={<LockClosedIcon className="h-20" />}
                className="flex justify-center"
              >
                Primary Icon
              </Button>
            </div>
          </div>

          <div className="mt-24 flex items-center">
            <p className="w-200 text-14 text-gray-600">Secondary icon right button:</p>
            <div className="ml-16 w-[30%]">
              <Button
                variant="secondary"
                iconPosition="right"
                size="full"
                onClick={toggleButtonFeedback}
                loading={loading}
                added={added}
                icon={<LockClosedIcon className="h-20" />}
                className="flex justify-center"
              >
                Secondary Icon
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Default = Template.bind({});
