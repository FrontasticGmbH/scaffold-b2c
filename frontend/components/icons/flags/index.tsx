import React from 'react';
import dynamic from 'next/dynamic';

const France = dynamic(() => import('./france'));
const Germany = dynamic(() => import('./germany'));
const Greece = dynamic(() => import('./greece'));
const Italy = dynamic(() => import('./italy'));
const Netherlands = dynamic(() => import('./netherlands'));
const Portugal = dynamic(() => import('./portugal'));
const Spain = dynamic(() => import('./spain'));
const Sweden = dynamic(() => import('./sweden'));
const UnitedKingdom = dynamic(() => import('./united-kingdom'));
const UnitedStates = dynamic(() => import('./united-states'));

type Props = {
  flagName: string;
  className?: string;
};

const Icon: React.FC<Props> = ({ className, flagName }: Props) => {
  const iconClassNames = `h-14 w-21 ${className}`;
  const flags = {
    france: <France className={iconClassNames} />,
    DE: <Germany className={iconClassNames} />,
    greece: <Greece className={iconClassNames} />,
    italy: <Italy className={iconClassNames} />,
    netherlands: <Netherlands className={iconClassNames} />,
    portugal: <Portugal className={iconClassNames} />,
    spain: <Spain className={iconClassNames} />,
    sweden: <Sweden className={iconClassNames} />,
    GB: <UnitedKingdom className={iconClassNames} />,
    US: <UnitedStates className={iconClassNames} />,
  };
  return <>{flags[flagName as keyof typeof flags]}</>;
};

export default Icon;
