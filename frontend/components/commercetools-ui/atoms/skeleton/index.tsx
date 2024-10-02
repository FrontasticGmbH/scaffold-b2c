import { FC } from 'react';
import ReactSkeleton from 'react-loading-skeleton';

const Skeleton: FC = () => {
  return (
    <span className="absolute left-0 top-0 z-10 size-full" data-testid="skeleton">
      <ReactSkeleton className="size-full" />
    </span>
  );
};

export default Skeleton;
