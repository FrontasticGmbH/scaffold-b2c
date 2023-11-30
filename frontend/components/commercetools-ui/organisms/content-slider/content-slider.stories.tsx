import React from 'react';
import { Story, Meta } from '@storybook/react';
import Typography from 'components/commercetools-ui/atoms/typography';
import ContentSlider from '.';
import { ContentSliderProps } from './types';

export default {
  title: 'Components/Content Slider',
  component: ContentSlider,
} as Meta;

const Template: Story<ContentSliderProps> = () => {
  const slides: ContentSliderProps['slides'] = Array(3).fill({
    image: {
      media: {
        mediaId: 'afbddilfzvvw9hdkwikv',
        resourceType: 'image',
        name: 'AdobeStock 510169269',
        tags: ['__none'],
        file: 'https://res.cloudinary.com/dlwdq84ig/image/upload/v1662622862/afbddilfzvvw9hdkwikv.jpg',
        size: 516362,
        width: 1378,
        height: 1378,
        format: 'jpg',
        created: '2022-09-08T07:41:02+00:00',
      },
    },
    title: 'The Interior Trends of 2022',
    target: null,
    ctaLabel: 'Read more',
    ctaReference: null,
  });

  return (
    <div className="ml-44">
      <Typography className="mt-40 w-[40%] text-28 font-bold text-black">Content Slider</Typography>
      <Typography className="mt-20 w-[60%] text-20 leading-loose text-neutral-700">
        The Content Slider displays a selection of blog posts or inspirational content.
      </Typography>
      <div className="mt-40">
        <ContentSlider
          title="Get Inspired"
          subtitle="Explore our editors guide of seasonal trends and favorites."
          slides={slides}
        />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
