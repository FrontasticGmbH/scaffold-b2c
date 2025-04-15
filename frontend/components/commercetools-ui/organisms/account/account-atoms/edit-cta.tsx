import { FC } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import Link from 'components/commercetools-ui/atoms/link';

type EditCTAProps = {
  editHref: string;
};

const EditCTA: FC<EditCTAProps> = ({ editHref }) => {
  const translate = useTranslations();
  return (
    <Link link={editHref} className="h-fit">
      <p className="hidden border-b border-transparent text-14 font-medium text-primary hover:cursor-pointer hover:border-primary md:block">
        {translate('common.edit')}
      </p>
      <div className="relative grid size-40 place-items-center rounded-full bg-neutral-200 shadow-100 md:hidden">
        <PencilSquareIcon className="absolute size-20 text-gray-600" />
      </div>
    </Link>
  );
};

export default EditCTA;
