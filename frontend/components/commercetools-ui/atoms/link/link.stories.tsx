import { Meta, Story } from '@storybook/react';
import Link, { LinkProps } from '.';
import Typography from '../typography';

export default {
  title: 'Atoms/Link',
  component: Link,
} as Meta;

const Template: Story<LinkProps> = () => (
  <div className="ml-44">
    <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Link</Typography>
    <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
      The Link allows customers to navigate to other pages or take actions.
    </Typography>

    <div className="mt-40 w-[70%]">
      <Link variant="primary" link="https://www.youtube.com" placeholder="Placeholder">
        Primary link go there
      </Link>
    </div>
    <div className="mt-20 w-[70%]">
      <Link variant="breadcrumb" link="https://www.youtube.com" placeholder="Placeholder">
        Breadcrumb link go there
      </Link>
    </div>
    <div className="mt-20 w-[70%]">
      <Link variant="menu-header" link="https://www.youtube.com" placeholder="Placeholder">
        Menu header link go there
      </Link>
    </div>
    <div className="mt-20 w-[70%]">
      <Link variant="menu-item" link="https://www.youtube.com" placeholder="Placeholder">
        Menu item link go there
      </Link>
    </div>
  </div>
);

export const Default = Template.bind({});
