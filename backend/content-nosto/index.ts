import { DataSourceConfiguration, DataSourceContext, ExtensionRegistry } from '@frontastic/extension-types';
import { Product } from '@Types/product/Product';
import { ValidationError } from './utils/Errors';
import BaseApi from './apis/BaseApi';
import RecommendationApiFactory from './apis/RecommendationApiFactory';

export default {
  'data-sources': {
    'nosto/product-recommendations': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      validate(config, context);
      const { target, nostoSessionId } = context.request.query;
      const { pageType, placementId } = config.configuration;
      const recommendApi: BaseApi = RecommendationApiFactory.getInstance(
        context.frontasticContext,
        nostoSessionId,
        pageType,
      );
      const recommendedProducts: Product[] = await recommendApi.fetchRecommendation(target, placementId);
      return {
        dataSourcePayload: { recommendedProducts },
      };
    },
  },
} as ExtensionRegistry;

function validate(config: DataSourceConfiguration, context: DataSourceContext) {
  if (!context.hasOwnProperty('request')) {
    throw new ValidationError({
      message: `Request is not defined in context ${context}`,
    });
  }
  if (!config.hasOwnProperty('configuration')) {
    throw new ValidationError({
      message: `Configuration is not defined in data source configuration ${config}`,
    });
  }

  const target: string = context.request?.query?.target;
  const pageType: string = config.configuration?.pageType;
  const nostoSessionId: string = context.request.query.nostoSessionId;

  if (!target) {
    throw new ValidationError({
      message: `target is not defined in context request ${context.request}`,
    });
  }
  if (!pageType) {
    throw new ValidationError({
      message: `pageType is not defined in data source configuration ${config.configuration}`,
    });
  }
  if (!nostoSessionId) {
    throw new ValidationError({
      message: `nostoSessionId is not defined in context request ${context.request}`,
    });
  }
}
