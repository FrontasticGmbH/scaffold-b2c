import { Log } from 'helpers/errorLogger';
import { TasticConfiguration, DataSources } from '../types';

// injects the data sources from the root level into the node
// where it is used inside the tree. the data becomes available
// via the data property of then object.
// For example, it turns this:
// {
//      "_type": "Frontastic\\Catwalk\\NextJsBundle\\Domain\\Api\\TasticFieldValue\\DataSourceReference",
//      "dataSourceId": "900dff96-3df6-48f0-9719-754d06665794",
// }
// into this:
// {
//     "_type": "Frontastic\\Catwalk\\NextJsBundle\\Domain\\Api\\TasticFieldValue\\DataSourceReference",
//     "dataSourceId": "900dff96-3df6-48f0-9719-754d06665794",
//     "dataSource": DataStreamDetails
// }
export function injectDataSources(
  block: TasticConfiguration,
  dataSources: DataSources,
): TasticConfiguration | Record<string, unknown> {
  // reduces over all elements of the current object, starts with an empty one
  return Object.entries(block).reduce((acc, [key, value]) => {
    // if a dataSourceId is found, inject the data of the same ID from the dataSources list
    if (key === 'dataSourceId') {
      if (!dataSources[value].ok && dataSources[value].message) {
        // @TODO:
        // * Better error formatting
        // * Log request ID (even link to a Kibana search right away during dev?)
        Log.error(new Error('Data source error: ' + dataSources[value].message));
      }
      return { ...acc, [key]: value, dataSource: dataSources[value] };
    } else {
      // if the value is another object, traverse deeper into the tree
      if (Array.isArray(value)) {
        return { ...acc, [key]: value };
      }

      if (typeof value === 'object' && value !== null) {
        return { ...acc, [key]: injectDataSources(value, dataSources) };
      } else {
        return { ...acc, [key]: value };
      }
    }
  }, {});
}
