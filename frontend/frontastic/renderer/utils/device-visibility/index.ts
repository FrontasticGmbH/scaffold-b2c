import { Configuration } from '@frontastic/extension-types';

export const deviceVisibility = (configuration: Configuration) => {
  return `${configuration.mobile ? 'block' : 'hidden'} ${configuration.tablet ? 'md:block' : 'md:hidden'} ${
    configuration.desktop ? 'lg:block' : 'lg:hidden'
  }`;
};
