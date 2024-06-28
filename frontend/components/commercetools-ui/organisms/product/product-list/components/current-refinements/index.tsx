import React from 'react';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import { useFormat } from 'helpers/hooks/useFormat';
import { textToColor } from 'helpers/textToColor/textToColor';
import { useProductList } from '../../context';

const CurrentRefinements = () => {
  const { formatMessage: formatProductMessage } = useFormat({ name: 'product' });

  const { activeRefinements, removeAllRefinements } = useProductList();

  if (!activeRefinements.length) return <></>;

  return (
    <div className="flex flex-wrap items-center justify-start gap-14 pt-16">
      {activeRefinements.map((refinement) => (
        <div
          key={refinement.label}
          className="flex cursor-default items-center justify-center gap-8 rounded-md border border-neutral-500 bg-white px-8 py-6 transition hover:border-primary-black"
        >
          <span className="text-14 leading-[20px] text-secondary-black">
            {refinement.label.includes(':') ? textToColor(refinement.label).label : refinement.label}
          </span>
          <CloseIcon className="w-20 cursor-pointer fill-secondary-black stroke-0" onClick={refinement.refine} />
        </div>
      ))}
      <div className="flex cursor-default items-center justify-center gap-8 rounded-md border border-transparent bg-white px-8 py-6 transition hover:border-primary-black">
        <span className="text-14">{formatProductMessage({ id: 'clear.all', defaultMessage: 'Clear All' })}</span>
        <CloseIcon className="w-20 cursor-pointer fill-secondary-black stroke-0" onClick={removeAllRefinements} />
      </div>
    </div>
  );
};

export default CurrentRefinements;
