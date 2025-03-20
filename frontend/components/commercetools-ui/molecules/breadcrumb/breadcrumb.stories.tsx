import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Link from 'components/commercetools-ui/atoms/link';
import Breadcrumb, { BreadcrumbProps } from '.';

export default {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  argTypes: {},
} as Meta;

const Template: StoryFn<BreadcrumbProps> = () => (
  <div className="ml-44">
    <p className="mt-40 w-2/5 text-28 font-bold text-black">Breadcrumb Component</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Breadcrumb Component displays the path of the current page.
    </p>
    <div className="mt-44">
      <Breadcrumb Separator="/" className="col-span-12 mb-24 hidden w-fit lg:block">
        <Link link="" className="text-14 text-primary">
          Home
        </Link>

        <Link link="" className="text-14 text-primary">
          Category
        </Link>

        <p className="cursor-default text-14 text-neutral-500">Product</p>
      </Breadcrumb>
    </div>
  </div>
);

export const Default = Template.bind({});
