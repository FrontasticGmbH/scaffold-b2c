import * as React from 'react';
import { classnames } from 'helpers/utils/classnames';
import { GridProps } from './types';

const Grid = ({ children, wrapperClassName, gridClassName }: GridProps) => {
  return (
    <div className={wrapperClassName}>
      <div className={classnames('grid', 'grid-cols-12', gridClassName)}>{children}</div>
    </div>
  );
};

export default Grid;
