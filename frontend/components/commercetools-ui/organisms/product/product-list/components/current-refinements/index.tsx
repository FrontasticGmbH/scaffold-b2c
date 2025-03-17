import React from 'react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'use-intl';
import { textToColor } from 'helpers/textToColor/textToColor';
import { useProductList } from '../../context';

const CurrentRefinements = () => {
  const translate = useTranslations();

  const { activeRefinements, removeAllRefinements } = useProductList();

  if (!activeRefinements.length) return <></>;

  return (
    <div className="flex flex-wrap items-center justify-start gap-14 pt-16">
      {activeRefinements.map((refinement) => (
        <div
          key={refinement.label}
          className="flex cursor-default items-center justify-center gap-8 rounded-md border border-neutral-500 bg-white px-8 py-6 transition hover:border-primary"
        >
          <span className="text-14 leading-[20px] text-gray-600">
            {refinement.label?.includes(':') ? textToColor(refinement.label).label : refinement.label}
          </span>
          <CloseIcon className="w-20 cursor-pointer fill-gray-600 stroke-0" onClick={refinement.refine} />
        </div>
      ))}
      <div className="flex cursor-default items-center justify-center gap-8 rounded-md border border-transparent bg-white px-8 py-6 transition hover:border-primary">
        <span className="text-14">{translate('product.clear-all')}</span>
        <CloseIcon className="w-20 cursor-pointer fill-gray-600 stroke-0" onClick={removeAllRefinements} />
      </div>
    </div>
  );
};

export default CurrentRefinements;
