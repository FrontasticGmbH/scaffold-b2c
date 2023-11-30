import { ComponentMeta, ComponentStory } from '@storybook/react';
import Input from '.';
import InputPassword from '../input-password';
import Typography from '../typography';

export default {
  title: 'Components/Input',
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
        <Typography className="w-[40%] text-24 font-medium text-primary-black">Input Default</Typography>

        <div className="mt-20">
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
      <div className="w-[30%]">
        <Typography className="w-[40%] text-24 font-medium text-primary-black">Input Password</Typography>

        <div className="w-full">
          <div className="mt-20">
            <InputPassword {...args} variant="primary" placeholder="Placeholder" label="Primary password" />
          </div>
          <div className="mt-16">
            <InputPassword
              {...args}
              variant="primary"
              error="An error occured while entering an unworthy password"
              placeholder="Placeholder"
              label="Primary password - Invalid"
              className="border-red-500"
            />
          </div>
          <div className="mt-16">
            <InputPassword {...args} variant="secondary" placeholder="Placeholder" label="Secondary password" />
          </div>
          <div className="mt-16">
            <InputPassword
              {...args}
              variant="secondary"
              isValid
              placeholder="Placeholder"
              label="Secondary password - valid"
              className="border-green-500"
            />
          </div>
          <div className="mt-16">
            <InputPassword {...args} disabled placeholder="Placeholder" label="Disabled password" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Default = Template.bind({});
