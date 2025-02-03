import React from 'react';
import { tastics } from 'frontastic/tastics';
import { TasticWrapperProps } from './types';
import { deviceVisibility } from '../../utils/device-visibility';
import { highlight } from '../../utils/highlight';
import { injectDataSources } from '../../utils/inject-datasources';
import MissingTastic from '../missing-tastic';

const TasticWrapper = ({
  data,
  params,
  searchParams,
  dataSources,
  isHighlighted,
  categories,
  flattenedCategories,
}: TasticWrapperProps) => {
  const Tastic = tastics[data.tasticType];

  const resolvedTasticData = dataSources ? injectDataSources(data.configuration, dataSources) : data.configuration;

  return (
    <div id={data?.tasticId} className={`${highlight(isHighlighted)} ${deviceVisibility(data.configuration)}`}>
      {Tastic ? (
        <Tastic
          data={resolvedTasticData}
          params={params}
          searchParams={searchParams}
          categories={categories}
          flattenedCategories={flattenedCategories}
        />
      ) : (
        <MissingTastic data={data} />
      )}
    </div>
  );
};

export default TasticWrapper;
