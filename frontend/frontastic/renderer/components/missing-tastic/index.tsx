'use client';

import React from 'react';
import * as levenshtein from 'fastest-levenshtein';
import { tastics } from 'frontastic/tastics';
import { TasticWrapperProps } from '../tastic-wrapper/types';

const MissingTastic = ({ data }: Pick<TasticWrapperProps, 'data'>) => {
  if (process.env.NODE_ENV === 'production') return <></>;

  return (
    <div className="p-32">
      <div className="rounded-md border border-orange-600 px-16 py-8 text-orange-600">
        <p>
          Tastic <b>{data.tasticType}</b> was not found. Did you mean{' '}
          <b>{levenshtein.closest(data.tasticType, Object.keys(tastics))}</b>?
        </p>
      </div>
    </div>
  );
};

export default MissingTastic;
