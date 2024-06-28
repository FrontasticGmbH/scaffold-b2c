import { ComponentMeta, ComponentStory } from '@storybook/react';
import Input from '.';
import Typography from '../typography';

export default {
  title: 'Atoms/Input',
  component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => (
  <div className="ml-44">
    <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Input Field</Typography>
    <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
      The Input Field allows customers to enter data or information. It has a top label, placeholder and validation.
    </Typography>

    <div className="mt-40 flex w-full justify-start gap-x-80">
      <div className="w-[30%]">
        <Input {...args} variant="primary" placeholder="Placeholder" label="Primary input" />
        <div className="mt-16">
          <Input
            {...args}
            variant="primary"
            error="Invalid input"
            placeholder="Placeholder"
            label="Primary input - invalid"
            className="border-red-500"
          />
        </div>
        <div className="mt-16">
          <Input {...args} variant="secondary" placeholder="Placeholder" label="Secondary input" />
        </div>
        <div className="mt-16">
          <Input
            {...args}
            isValid
            variant="secondary"
            placeholder="Placeholder"
            label="Secondary input - valid"
            className="border-green-500"
          />
        </div>
        <div className="mt-16">
          <Input {...args} disabled placeholder="Placeholder" label="Disabled" />
        </div>
      </div>
    </div>
  </div>
);

export const Default = Template.bind({});
