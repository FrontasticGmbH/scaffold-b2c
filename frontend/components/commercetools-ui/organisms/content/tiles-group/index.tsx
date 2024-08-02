import React from 'react';
import useImageSizes from 'helpers/hooks/useImageSizes';
import Tile, { TileProps } from '../../../molecules/tile';

export interface Props {
  tiles: TileProps[];
}

const TilesGroup: React.FC<Props> = ({ tiles }) => {
  const imageSizes = useImageSizes({ md: 1, lg: 0.5, defaultSize: 0.5 });

  return (
    <div className="bg-neutral-200 lg:px-20 xl:px-48">
      <div className="flex flex-col bg-neutral-200 md:flex-row lg:gap-16">
        {tiles.map((tile, index) => (
          <Tile
            key={index}
            {...tile}
            image={{ ...tile.image, fill: true, sizes: imageSizes, alt: tile.title ?? '' }}
            className="h-320 lg:h-[475px]"
          />
        ))}
      </div>
    </div>
  );
};

export default TilesGroup;
