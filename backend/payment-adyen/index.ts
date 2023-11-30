import { ExtensionRegistry } from '@frontastic/extension-types';
import * as AdyenActions from './actionControllers/AdyenController';

export default {
  actions: {
    adyen: AdyenActions,
  },
} as ExtensionRegistry;
