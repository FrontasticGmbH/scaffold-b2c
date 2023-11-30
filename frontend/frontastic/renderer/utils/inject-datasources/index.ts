import { TasticConfiguration } from '@frontastic/extension-types';
import { DataSources } from 'frontastic/lib/types';

export const injectDataSources = (block: TasticConfiguration, dataSources: DataSources) => {
  // reduces over all elements of the current object, starts with an empty one
  const result = Object.entries(block).reduce((acc, [key, value]) => {
    // if a dataSourceId is found, inject the data of the same ID from the dataSources list
    if (key === 'dataSourceId') {
      return { ...acc, [key]: value, dataSource: dataSources[value] };
    } else {
      if (Array.isArray(value)) {
        return { ...acc, [key]: value };
      }

      if (typeof value === 'object' && value !== null) {
        // if the value is another object, traverse deeper into the tree
        return { ...acc, [key]: injectDataSources(value, dataSources) };
      } else {
        return { ...acc, [key]: value };
      }
    }
  }, {}) as TasticConfiguration & { dataSource?: DataSources };

  return result;
};
