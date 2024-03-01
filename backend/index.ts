// START: List of used extensions

/* POLYFILLS */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  ExtensionRegistry,
  ActionRegistry,
  DynamicPageHandler,
  DynamicPageRedirectResult,
  DynamicPageSuccessResult,
} from '@frontastic/extension-types';
import commercetoolsExtension from '@Commerce-commercetools';
import contentfulExtensions from '@Content-contentful';
import dynamicyieldExtensions from '@Content-dynamicyield';
import amplienceExtensions from '@Content-amplience';
import contentstackExtensions from '@Content-contentstack';
import bloomreachExtensions from '@Content-bloomreach';
import nostoExtensions from '@Content-nosto';
import talonOneExtension from '@Promotion-talon-one';

// Intregration tests

const extensionsToMerge = [
  commercetoolsExtension,
  contentfulExtensions,
  dynamicyieldExtensions,
  amplienceExtensions,
  contentstackExtensions,
  bloomreachExtensions,
  talonOneExtension,
  nostoExtensions,
] as Array<ExtensionRegistry>;
// END: List of used extensions

const mergeActions = (extensions: Array<ExtensionRegistry>): ActionRegistry => {
  const actionNamespaces = {};
  for (const extension of extensions) {
    for (const actionNamespace in extension['actions'] || {}) {
      if (!actionNamespaces[actionNamespace]) {
        actionNamespaces[actionNamespace] = {};
      }
      actionNamespaces[actionNamespace] = Object.assign(
        {},
        actionNamespaces[actionNamespace],
        extension['actions'][actionNamespace],
      );
    }
  }
  return actionNamespaces;
};

type PossibleDynamicPageResults = DynamicPageSuccessResult | DynamicPageRedirectResult | null;
type DynamicPageHandlerResponse = PossibleDynamicPageResults | Promise<PossibleDynamicPageResults>;

const mergeDynamicPageHandlers = (extensions: Array<ExtensionRegistry>): DynamicPageHandler => {
  return async (request, dynamicPageContext) => {
    for (const extension of extensions) {
      if (extension['dynamic-page-handler']) {
        const result: DynamicPageHandlerResponse = await extension['dynamic-page-handler'](request, dynamicPageContext);

        if (result !== null) {
          return result;
        }
      }
    }

    return null;
  };
};

export default {
  'dynamic-page-handler': mergeDynamicPageHandlers(extensionsToMerge),
  'data-sources': extensionsToMerge
    .map((extension) => {
      return extension['data-sources'] || {};
    })
    .reduce(Object.assign, {}),
  actions: mergeActions(extensionsToMerge),
} as ExtensionRegistry;
