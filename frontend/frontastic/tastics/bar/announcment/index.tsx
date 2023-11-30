'use client';

import React from 'react';
import AnnouncementBar, { Props as AnnouncementBarProps } from 'components/commercetools-ui/organisms/announcement-bar';
import { TasticProps } from 'frontastic/tastics/types';

const AnnouncementBarTastic = ({ data }: TasticProps<AnnouncementBarProps>) => {
  return <AnnouncementBar {...data} />;
};

export default AnnouncementBarTastic;
