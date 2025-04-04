import React from 'react';
import Button from 'components/commercetools-ui/atoms/button';
import Image, { ImageProps } from 'components/commercetools-ui/atoms/image';
import Link from 'components/commercetools-ui/atoms/link';
import { Link as CategoryLink } from 'components/commercetools-ui/organisms/header/types';
import useClassNames from 'helpers/hooks/useClassNames';

type Props = {
  image: ImageProps;
  title: string;
  subtitle: string;
  categories: CategoryLink[];
  className?: string;
  handleCategoryClick?: () => void;
};

export const EmptyState: React.FC<Props> = ({
  image,
  title,
  subtitle,
  categories,
  handleCategoryClick,
  className = '',
}: Props) => {
  const titleClassNames = useClassNames(['py-36 text-center overflow-auto', className]);

  return (
    <div className={titleClassNames}>
      <h6 className="text-center">{title}</h6>
      <div className="hidden w-full justify-center md:flex">
        <div className="relative h-92 w-197 px-10 text-center md:mb-32 md:mt-55">
          <Image media={image?.media} fill style={{ objectFit: 'contain' }} alt={image?.title} />
        </div>
      </div>
      <ul className="mt-55 flex flex-col items-center gap-y-20">
        <h6 className="text-center">{subtitle}</h6>
        {categories?.map((category) => (
          <li key={category.name} onClick={handleCategoryClick}>
            <Link link={category.reference}>
              <Button className="w-200 rounded-md border border-primary text-16 text-gray-600" variant="secondary">
                {category.name}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
