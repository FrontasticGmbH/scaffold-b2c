import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { products } from 'helpers/mocks/mockCommonData';
import { categories } from 'helpers/mocks/mockData';
import Search from '.';
import SearchAlgolia from '../search-algolia';

export default {
  title: 'Organisms/Search',
  component: Search,
} as Meta<typeof Search>;

const Template: StoryFn<typeof Search> = (args) => (
  <div className="ml-44 h-full">
    <p className="mt-36 w-[45%] text-28 font-bold text-black">Default Search and Algolia Search</p>
    <p className="mt-20 w-3/5 text-20 leading-loose text-neutral-700">
      The Search component consists of an input field where customers can enter keywords or phrases related to the
      content they are searching for. The Search bar presents search auto-suggestions and product suggestions.The search
      component integrated with Algolia
    </p>

    <p className="mt-36 w-2/5 text-20 font-medium text-primary">Default Search</p>

    <div className="mt-20 w-[70%]">
      <Search {...args} />
    </div>
    <p className="mt-36 w-2/5 text-20 font-medium text-primary">Algolia Search</p>
    <p className="mt-12 w-3/5 leading-loose text-neutral-700">The search component integrated with Algolia.</p>

    <div className="mt-20 w-[70%]">
      <SearchAlgolia {...args} />
    </div>
  </div>
);

export const DefaultSearch = Template.bind({});
DefaultSearch.args = {
  categories: categories,
  items: products,
};
