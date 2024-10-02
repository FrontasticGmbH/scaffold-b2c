import React, { FC } from 'react';
import Image from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { Tile } from 'components/commercetools-ui/organisms/header/types';
import useClassNames from 'helpers/hooks/useClassNames';

export interface Props {
  tileContent: Tile;
}

const HeaderDropdownTile: FC<Props> = ({ tileContent }) => {
  const tileHeaderTextClassName = useClassNames([
    'text-white drop-shadow-xl pb-15 text-center text-28',
    tileContent?.tileHeaderDecoration,
  ]);
  const tileButtonClassName = useClassNames(['border-b-2 drop-shadow-xl', tileContent?.tileButtonLabelDecoration]);

  return (
    <div className="relative mt-2 h-265 w-[30%] xl:pl-20">
      <Image
        media={tileContent?.tileImage.media}
        fill
        style={{ objectFit: 'cover' }}
        className="brightness-75"
        alt={tileContent?.tileImage.title ?? ''}
      />
      <div className="absolute left-1/2 top-[42%] h-35 w-full -translate-x-1/2 -translate-y-1/2">
        <Typography as="h3" className={tileHeaderTextClassName}>
          {tileContent?.tileHeaderText}
        </Typography>
        <div className="flex justify-center">
          <Link variant="primary" link={tileContent?.tileButtonLink} className={tileButtonClassName}>
            <Typography className="text-22 text-white">{tileContent?.tileButtonLabel}</Typography>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderDropdownTile;
