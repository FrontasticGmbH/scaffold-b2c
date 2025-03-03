import React, { type JSX, useEffect, useRef } from 'react';
import useClassNames from 'helpers/hooks/useClassNames';
import { useFormat } from 'helpers/hooks/useFormat';

interface Props {
  number: number;
  label: string;
  isExpanded: boolean;
  isCompleted: boolean;
  onEdit: () => void;
  Component: JSX.Element;
  Preview: JSX.Element;
  CTA?: JSX.Element;
}

const Step: React.FC<Props> = ({ number, label, isExpanded, isCompleted, onEdit, Component, Preview, CTA }) => {
  const { formatMessage } = useFormat({ name: 'common' });

  const ref = useRef<HTMLDivElement>(null);

  const headerClassName = useClassNames([
    'rounded-t-sm p-12 border transition lg:px-36 lg:py-24 lg:bg-white lg:rounded-t-md flex items-center justify-between',
    {
      'bg-primary border-primary lg:border-none': isExpanded,
      'bg-white border-neutral-400': !isExpanded,
    },
  ]);

  const numberClassName = useClassNames([
    'rounded-full w-24 h-24 flex items-center justify-center border text-14 md:text-16 font-medium transition lg:border-primary leading-[38px] md:w-30 md:h-30',
    {
      'border-white bg-primary text-white': isExpanded,
      'border-primary bg-white text-primary': !isExpanded,
    },
  ]);

  const labelClassName = useClassNames([
    'transition lg:text-primary lg:text-18',
    {
      'text-white': isExpanded,
      'text-primary': !isExpanded,
    },
  ]);

  useEffect(() => {
    if (isExpanded && ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isExpanded]);

  return (
    <div className="bg-white" ref={ref}>
      <div className={headerClassName}>
        <div className="flex cursor-default items-center gap-12 lg:gap-16">
          <span className={numberClassName}>{number}</span>
          <h5 className={labelClassName}>{label}</h5>
        </div>
        {isCompleted && !isExpanded && (
          <p
            className="text-14 text-gray-600 underline decoration-gray-600 underline-offset-2 hover:cursor-pointer"
            onClick={onEdit}
          >
            {formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
          </p>
        )}
        {isExpanded && (
          <span className="text-white decoration-white lg:text-gray-600 lg:decoration-primary">{CTA}</span>
        )}
      </div>
      <div>
        <div className={isCompleted && !isExpanded ? 'block' : 'hidden'}>{Preview}</div>
        <div className={isExpanded ? 'block' : 'hidden'}>{Component}</div>
      </div>
    </div>
  );
};

export default Step;
