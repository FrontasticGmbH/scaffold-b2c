import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { categories } from 'helpers/mocks/mockData';
import Search from '.';
import SearchAlgolia from '../search-algolia';
import Typography from '../typography';

export default {
  title: 'Organisms/Search',
  component: Search,
} as ComponentMeta<typeof Search>;

const Template: ComponentStory<typeof Search> = (args) => (
  <div className="ml-44 h-full">
    <Typography className="mt-36 w-[45%] text-28 font-bold text-black">Default Search and Algolia Search</Typography>
    <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
      The Search component consists of an input field where customers can enter keywords or phrases related to the
      content they are searching for. The Search bar presents search auto-suggestions and product suggestions.The search
      component integrated with Algolia
    </Typography>

    <Typography className="mt-36 w-[40%] text-20 font-medium text-primary-black">Default Search</Typography>

    <div className="mt-20 w-[70%]">
      <Search {...args} />
    </div>
    <Typography className="mt-36 w-[40%] text-20 font-medium text-primary-black">Algolia Search</Typography>
    <Typography className="mt-12 w-[60%] leading-loose text-neutral-700">
      The search component integrated with Algolia.
    </Typography>

    <div className="mt-20 w-[70%]">
      <SearchAlgolia {...args} categories={categories} />
    </div>
  </div>
);

export const DefaultSearch = Template.bind({});
DefaultSearch.args = {
  categories: [],
};
