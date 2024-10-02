import { InboxIcon, QuestionMarkCircleIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { default as LockIcon } from 'components/icons/lock';
import { default as LoopIcon } from 'components/icons/loop';
import { default as RocketIcon } from 'components/icons/rocket';

export const renderIcon = (name: string) => {
  switch (name) {
    case 'rocket':
      return <RocketIcon className="size-6 text-gray-400" aria-hidden="true" />;
    case 'loop':
      return <LoopIcon className="size-6 text-gray-400" aria-hidden="true" />;
    case 'question':
      return <QuestionMarkCircleIcon className="size-6 text-gray-400" aria-hidden="true" />;
    case 'inbox':
      return <InboxIcon className="size-6 text-gray-400" aria-hidden="true" />;
    case 'speaker':
      return <SpeakerWaveIcon className="size-6 text-gray-400" aria-hidden="true" />;
    default:
      return <LockIcon className="size-4 text-gray-400" aria-hidden="true" />;
  }
};
