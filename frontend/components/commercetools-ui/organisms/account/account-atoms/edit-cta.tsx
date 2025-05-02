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
      <p className="hidden border-b border-transparent text-14 font-medium text-primary underline hover:cursor-pointer hover:border-primary md:block">
        {translate('common.edit')}
      </p>
      <div className="rounded-md border border-gray-700 p-10 md:hidden">
        <PencilSquareIcon className="size-16 stroke-[2px] text-gray-700" />
      </div>
    </Link>
  );
};

export default EditCTA;
