import { classnames } from 'helpers/utils/classnames';
import { cva } from 'helpers/utils/cva';
import { InfoBannerProps } from '../../types';

const useClassNames = ({ variant }: Partial<InfoBannerProps>) => {
  const resolveBannerVariant = cva({
    intent: {
      primary: 'bg-blue-100',
      warning: 'bg-yellow-100',
    },
  });

  const resolveSidebarVariant = cva({
    intent: {
      primary: 'bg-blue-500',
      warning: 'bg-yellow-500',
    },
  });

  const bannerClassName = classnames(
    'flex items-stretch gap-3 overflow-hidden rounded-md md:gap-4 lg:gap-5',
    resolveBannerVariant(`intent.${variant}`) as string,
  );

  const sidebarClassName = classnames('block w-[8px] shrink-0', resolveSidebarVariant(`intent.${variant}`) as string);

  return { bannerClassName, sidebarClassName };
};

export default useClassNames;
