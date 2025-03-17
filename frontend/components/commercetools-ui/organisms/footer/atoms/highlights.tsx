import React from 'react';
import { GiCycle as CycleIcon } from 'react-icons/gi';
import { HiOutlineLockClosed as LockIcon } from 'react-icons/hi';
import { IoRocketOutline as RocketIcon } from 'react-icons/io5';
import { useTranslations } from 'use-intl';
import HighlightBar from 'components/commercetools-ui/organisms/highlight-bar';

const Highlights = () => {
  const translate = useTranslations();

  const highlights = [
    {
      Icon: RocketIcon,
      text: translate('common.fast-delivery'),
    },
    {
      Icon: CycleIcon,
      text: translate('common.free-returns'),
    },
    {
      Icon: LockIcon,
      text: translate('common.safe-payment'),
    },
  ];

  return (
    <HighlightBar>
      {highlights.map(({ Icon, text }, index: number) => (
        <div
          key={index}
          className="flex flex-1 items-center justify-center gap-5 px-8 py-4 lg:justify-items-center lg:px-0"
        >
          <Icon size={30} />
          <span>{text}</span>
        </div>
      ))}
    </HighlightBar>
  );
};

export default Highlights;
