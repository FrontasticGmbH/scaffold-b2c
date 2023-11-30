import { FC } from 'react';
import ReactSkeleton from 'react-loading-skeleton';

const Skeleton: FC = () => {
  return (
    <span className="absolute left-0 top-0 z-10 h-full w-full">
      <ReactSkeleton className="h-full w-full" />
    </span>
  );
};

export default Skeleton;
