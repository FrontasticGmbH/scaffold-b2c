import Button from 'components/commercetools-ui/atoms/button';
import Image, { ImageProps } from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';
import useClassNames from 'helpers/hooks/useClassNames';
import { Reference } from 'types/reference';

export interface TileProps {
  image?: ImageProps;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaReference?: Reference;
  roundedBorders?: boolean;
  className?: string;
}

const Tile: React.FC<TileProps> = ({
  image,
  title,
  subtitle,
  ctaLabel,
  ctaReference,
  roundedBorders = true,
  className = '',
}) => {
  const imageClassName = useClassNames([{ 'lg:rounded-md': roundedBorders }]);

  return (
    <div className={`relative w-full ${className}`}>
      {image && (
        <Image {...image} alt={title} style={{ objectFit: 'cover' }} className={`brightness-75 ${imageClassName}`} />
      )}
      <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 text-center">
        <p className="text-shadow text-center text-14 leading-loose text-white md:text-16 lg:font-medium">{subtitle}</p>
        <h2 className="text-shadow mt-18 text-center text-26 font-medium text-white lg:text-28">{title}</h2>
        {ctaLabel && (
          <Link link={ctaReference}>
            <Button className="mt-24">
              <span className="text-12">{ctaLabel}</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Tile;
