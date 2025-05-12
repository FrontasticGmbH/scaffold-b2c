import React, { type JSX, useEffect, useRef } from 'react';
import { MdCheck } from 'react-icons/md';
import { useTranslations } from 'use-intl';
import useClassNames from 'helpers/hooks/useClassNames';
import { classnames } from 'helpers/utils/classnames';

interface Props {
  number: number;
  label: string;
  isExpanded: boolean;
  isCompleted: boolean;
  onEdit: () => void;
  Component: JSX.Element;
  Preview?: JSX.Element;
  CTA?: JSX.Element;
}

const Step: React.FC<Props> = ({ number, label, isExpanded, isCompleted, onEdit, Component, Preview, CTA }) => {
  const translate = useTranslations();

  const ref = useRef<HTMLDivElement>(null);

  const containerClassName = useClassNames(['rounded-lg bg-white', { 'pb-24': isExpanded || isCompleted }]);

  const headerClassName = useClassNames(['px-20 py-24 transition lg:px-24 flex items-center justify-between']);

  const numberClassName = useClassNames([
    'rounded-full flex items-center justify-center border text-16 font-medium transition lg:border-primary leading-[38px] size-32',
    {
      'border-white bg-primary text-white': isExpanded,
      'border-primary bg-white text-primary': !isExpanded,
    },
  ]);

  const completedNumberClassName = useClassNames([
    'rounded-full flex items-center text-green-700 justify-center bg-green-300 border lg:border-green-300 size-32',
  ]);

  const labelClassName = useClassNames(['transition text-primary lg:text-18 font-semibold']);

  useEffect(() => {
    if (isExpanded && ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [isExpanded]);

  return (
    <div className={containerClassName} ref={ref}>
      <div className={headerClassName}>
        <div className="flex cursor-default items-center gap-12 lg:gap-16">
          {!isCompleted || isExpanded ? (
            <span className={numberClassName}>{number}</span>
          ) : (
            <span className={completedNumberClassName}>
              <MdCheck className="size-20" />
            </span>
          )}
          <p className={labelClassName}>{label}</p>
        </div>
        {isCompleted && !isExpanded && (
          <p
            className="text-14 font-semibold text-gray-700 underline underline-offset-2 hover:cursor-pointer"
            onClick={onEdit}
          >
            {translate('common.edit')}
          </p>
        )}
        {isExpanded && <span className="text-14 font-semibold text-gray-700 hover:cursor-pointer">{CTA}</span>}
      </div>
      <div>
        <div className={classnames(isCompleted && !isExpanded ? 'block' : 'hidden', 'px-20 md:px-24')}>{Preview}</div>
        <div className={classnames(isExpanded || (isCompleted && !Preview) ? 'block' : 'hidden', 'px-20 md:px-24')}>
          {Component}
        </div>
      </div>
    </div>
  );
};

export default Step;
