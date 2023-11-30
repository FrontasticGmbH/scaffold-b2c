import React from 'react';
import { GiCycle as CycleIcon } from 'react-icons/gi';
import { HiOutlineLockClosed as LockIcon } from 'react-icons/hi';
import { IoRocketOutline as RocketIcon } from 'react-icons/io5';
import HighlightBar from 'components/commercetools-ui/organisms/highlight-bar';
import { useFormat } from 'helpers/hooks/useFormat';

const Highlights = () => {
  const { formatMessage } = useFormat({ name: 'common' });

  const highlights = [
    {
      Icon: RocketIcon,
      text: formatMessage({ id: 'fast.delivery', defaultMessage: 'Fast delivery' }),
    },
    {
      Icon: CycleIcon,
      text: formatMessage({ id: 'free.returns', defaultMessage: 'Free returns' }),
    },
    {
      Icon: LockIcon,
      text: formatMessage({ id: 'safe.payment', defaultMessage: 'Safe payment & data protection' }),
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
